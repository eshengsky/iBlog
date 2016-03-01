var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('util');
var eventproxy = require('eventproxy');
var category = require('../proxy/category');
var post = require('../proxy/post');
var tool = require('../utility/tool');
var moment = require('moment');
var url = require('url');

//分类页面
router.get('/:category?', function (req, res, next) {
    var currentCate = req.params.category || '',
        ep = new eventproxy();

    ep.all('settings', 'categories', function (settings, categories) {
        var cate = tool.jsonQuery(categories, {"Alias": currentCate});
        if (cate) {
            res.render('blog/index', {
                cateData: categories,
                settings: settings,
                title: settings['SiteName'],
                currentCate: currentCate,
                isRoot: false
            });
        } else {
            next();
        }
    });

    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            ep.emit('settings', settings);
        }
    });

    category.getAll(function (err, categories) {
        if (err) {
            next(err);
        } else {
            ep.emit('categories', categories);
        }
    });
});

//获取文章数据
router.post('/getPosts', function (req, res, next) {
    var ep = new eventproxy();
    ep.all('posts', 'pageCount', 'categories', function (posts, pageCount, categories) {
        var i = 0,
            len = posts.length,
            cateId,
            cateItem,
            result = [];
        for (; i < len; i++) {
            result[i] = {
                Source: posts[i].Source,
                Alias: posts[i].Alias,
                Title: posts[i].Title,
                Url: posts[i].Url,
                PublishDate: moment(posts[i].CreateTime).format('YYYY-MM-DD'),
                Host: posts[i].Url ? url.parse(posts[i].Url).host : '',
                Summary: posts[i].Summary,
                UniqueId: posts[i].UniqueId,
                ViewCount: posts[i].ViewCount
            };
            cateId = posts[i].CategoryId;
            cateItem = tool.jsonQuery(categories, {"_id": cateId});
            if (cateItem) {
                result[i].CategoryAlias = cateItem.Alias;
                result[i].CateName = cateItem.CateName;
            }
        }
        res.send({posts: result, pageCount: pageCount});
    });

    category.getByAlias(req.body.CateAlias, function (err, category) {
        var params;
        if (err) {
            next(err);
        } else {
            params = {
                cateId: category._id,
                pageIndex: req.body.PageIndex,
                pageSize: req.body.PageSize,
                sortBy: req.body.SortBy,
                keyword: req.body.Keyword,
                filterType: req.body.FilterType
            };
            post.getPosts(params, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    ep.emit('posts', data);
                }
            });

            post.getPostsCount(params, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    ep.emit('pageCount', data);
                }
            });
        }
    });

    category.getAll(function (err, data) {
        if (err) {
            next(err);
        } else {
            ep.emit('categories', data);
        }
    })
});

//根据文章alias获取预览数据
router.post('/getPreviewContent', function (req, res, next) {
    post.getPostByAlias(req.body.alias, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.send({Content: data.Content, Labels: data.Labels});
        }
    })
});

//文章详细页
router.get('/:category/:article', function (req, res, next) {
    var alias = req.params.article,
        cateAlias = req.params.category,
        ep = new eventproxy();

    ep.all('settings', 'article', 'categories', function (settings, article, categories) {
        var trueCateAlias = tool.jsonQuery(categories, {"_id": article.CategoryId}).Alias;
        if (cateAlias !== trueCateAlias) {
            res.redirect(util.format('/blog/%s/%s', trueCateAlias, alias));
        }

        var labels = article.Labels,
            labelList = [];
        if (labels) {
            labels = JSON.parse(labels);
            labels.forEach(function (lbl) {
                labelList.push(lbl.text);
            });
        }
        var post = {
            UniqueId: article.UniqueId,
            Title: article.Title,
            CategoryAlias: cateAlias,
            CateName: tool.jsonQuery(categories, {"_id": article.CategoryId}).CateName,
            CreateTimeStr: moment(article.CreateTime).format('YYYY-MM-DD hh:mm'),
            ViewCount: article.ViewCount,
            LabelList: labelList,
            Summary: article.Summary,
            Content: article.Content
        };
        res.render('blog/article', {
            post: post,
            settings: settings,
            title: settings['SiteName'] + ' - ' + article.Title
        });
    });

    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            ep.emit('settings', settings);
        }
    });

    post.getPostByAlias(alias, function (err, data) {
        if (err) {
            next(err);
        } else if (data === null) {
            next();
        } else {
            ep.emit('article', data);
        }
    });

    category.getAll(function (err, data) {
        if (err) {
            next(err);
        } else {
            ep.emit('categories', data);
        }
    })
});

module.exports = router;
