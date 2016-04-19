var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('util');
var async = require('async');
var category = require('../proxy/category');
var post = require('../proxy/post');
var tool = require('../utility/tool');
var moment = require('moment');
var url = require('url');

//分类页面
router.get('/:category?', function (req, res, next) {
    var currentCate = req.params.category || '';
    async.parallel([
        //获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },
        //获取分类
        function (cb) {
            category.getAll(function (err, categories) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], function (err, results) {
        var settings,
            categories,
            cate;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            categories = results[1];
            cate = tool.jsonQuery(categories, {"Alias": currentCate});
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
        }
    });
});

//获取文章数据
router.post('/getPosts', function (req, res, next) {
    async.parallel([
        //获取文章列表和文章页数
        function (cb) {
            async.waterfall([
                //1. 根据分类alias获取分类对象
                function (cb) {
                    category.getByAlias(req.body.CateAlias, function (err, category) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, category);
                        }
                    });
                },
                //2. 传入分类对象查询文章
                function (category, cb) {
                    var params = {
                        cateId: category._id,
                        pageIndex: req.body.PageIndex,
                        pageSize: req.body.PageSize,
                        sortBy: req.body.SortBy,
                        keyword: req.body.Keyword,
                        filterType: req.body.FilterType
                    };
                    async.parallel([
                        //文章列表
                        function (cb) {
                            post.getPosts(params, function (err, data) {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, data);
                                }
                            });
                        },
                        //文章页数
                        function (cb) {
                            post.getPageCount(params, function (err, data) {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, data);
                                }
                            });
                        }
                    ], function (err, results) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, results);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            });
        },
        //获取分类
        function (cb) {
            category.getAll(function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            })
        }
    ], function (err, results) {
        var posts,
            pageCount,
            categories,
            i,
            len,
            cateId,
            cateItem,
            result = [];
        if (err) {
            next(err);
        } else {
            posts = results[0][0];
            pageCount = results[0][1];
            categories = results[1];
            i = 0;
            len = posts.length;
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
        }
    });
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
        cateAlias = req.params.category;
    async.parallel([
        //获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },
        //根据文章alias获取文章对象
        function (cb) {
            post.getPostByAlias(alias, function (err, data) {
                if (err) {
                    cb(err);
                } else if (data === null) {
                    next();
                } else {
                    cb(null, data);
                }
            });
        },
        //获取分类
        function (cb) {
            category.getAll(function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            })
        }
    ], function (err, results) {
        var settings,
            article,
            categories,
            trueCateAlias,
            labels,
            labelList = [];
        if (err) {
            next(err);
        } else {
            settings = results[0];
            article = results[1];
            categories = results[2];
            trueCateAlias = tool.jsonQuery(categories, {"_id": article.CategoryId}).Alias;
            if (cateAlias !== trueCateAlias) {
                res.redirect(util.format('/blog/%s/%s', trueCateAlias, alias));
            }

            labels = article.Labels;
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
        }
    });
});

module.exports = router;
