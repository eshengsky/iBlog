const express = require('express');
const router = express.Router();
const path = require('path');
const util = require('util');
const async = require('async');
const category = require('../proxy/category');
const post = require('../proxy/post');
const tool = require('../utility/tool');
const moment = require('moment');
const url = require('url');
const showdown = require('showdown');

// 分类页面
router.get('/:category?', (req, res, next) => {
    const currentCate = req.params.category || '';
    async.parallel([
        // 获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },

        // 获取分类
        function (cb) {
            category.getAll((err, categories) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], (err, results) => {
        let settings,
            categories,
            cate;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            categories = results[1];
            cate = tool.jsonQuery(categories, { Alias: currentCate });
            if (cate || !currentCate || currentCate === 'other') {
                res.render('blog/index', {
                    cateData: categories,
                    settings,
                    title: settings.SiteName,
                    currentCate,
                    isRoot: false
                });
            } else {
                next();
            }
        }
    });
});

// 获取文章数据
router.post('/getPosts', (req, res, next) => {
    async.parallel([
        // 获取文章列表和文章页数
        function (cb) {
            async.waterfall([
                // 1. 根据分类alias获取分类对象
                function (cb) {
                    category.getByAlias(req.body.CateAlias, (err, category) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, category);
                        }
                    });
                },

                // 2. 传入分类对象查询文章
                function (category, cb) {
                    const params = {
                        cateId: category._id,
                        pageIndex: req.body.PageIndex,
                        pageSize: req.body.PageSize,
                        sortBy: req.body.SortBy,
                        keyword: req.body.Keyword,
                        filterType: req.body.FilterType
                    };
                    async.parallel([
                        // 文章列表
                        function (cb) {
                            post.getPosts(params, (err, data) => {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, data);
                                }
                            });
                        },

                        // 文章页数
                        function (cb) {
                            post.getPageCount(params, (err, data) => {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, data);
                                }
                            });
                        }
                    ], (err, results) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, results);
                        }
                    });
                }
            ], (err, result) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            });
        },

        // 获取分类
        function (cb) {
            category.getAll((err, data) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            });
        }
    ], (err, results) => {
        let posts,
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
            categories.unshift({
                _id: '',
                Alias: '',
                CateName: res.__('Category.all'),
                Img: '/static/images/全部分类.svg'
            });
            categories.push({
                _id: 'other',
                Alias: 'other',
                CateName: res.__('Category.uncate'),
                Img: '/static/images/未分类.svg'
            });
            i = 0;
            len = posts.length;
            for (; i < len; i++) {
                result[i] = {
                    Source: posts[i].Source,
                    Alias: posts[i].Alias,
                    Title: posts[i].Title,
                    Url: posts[i].Url,
                    PublishDate: moment(posts[i].CreateTime)
                        .format('YYYY-MM-DD'),
                    Host: posts[i].Url ? url.parse(posts[i].Url)
                        .host : '',
                    Summary: posts[i].Summary,
                    UniqueId: posts[i].UniqueId,
                    ViewCount: posts[i].ViewCount
                };
                cateId = posts[i].CategoryId;
                cateItem = tool.jsonQuery(categories, { _id: cateId });
                if (cateItem) {
                    result[i].CategoryAlias = cateItem.Alias;
                    result[i].CateName = cateItem.CateName;
                }
            }
            res.send({ posts: result, pageCount });
        }
    });
});

// 根据文章alias获取预览数据
router.post('/getPreviewContent', (req, res, next) => {
    post.getPostByAlias(req.body.alias, (err, data) => {
        if (err) {
            next(err);
        } else {
            let resultContent;
            if (data.ContentType === 'markdown') {
                const converter = new showdown.Converter();
                converter.setFlavor('github');
                resultContent = converter.makeHtml(data.Content);
            } else {
                resultContent = data.Content;
            }
            res.send({
                Content: resultContent,
                ContentType: data.ContentType,
                Labels: data.Labels
            });
        }
    });
});

// 文章详细页
router.get('/:category/:article', (req, res, next) => {
    let alias = req.params.article,
        cateAlias = req.params.category;
    async.parallel([
        // 获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },

        // 根据文章alias获取文章对象
        function (cb) {
            post.getPostByAlias(alias, (err, data) => {
                if (err) {
                    cb(err);
                } else if (data === null) {
                    next();
                } else {
                    cb(null, data);
                }
            });
        },

        // 获取分类
        function (cb) {
            category.getAll((err, data) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            });
        }
    ], (err, results) => {
        let settings,
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

            // 如果文章已被删除，且当前不是管理员登录状态，则显示 404
            if (!article.IsActive && !req.user) {
                return next();
            }

            categories = results[2];
            categories.unshift({
                _id: '',
                Alias: '',
                CateName: res.__('Category.all'),
                Img: '/static/images/全部分类.svg'
            });
            categories.push({
                _id: 'other',
                Alias: 'other',
                CateName: res.__('Category.uncate'),
                Img: '/static/images/未分类.svg'
            });
            trueCateAlias = tool.jsonQuery(categories, { _id: article.CategoryId })
                .Alias;
            if (cateAlias !== trueCateAlias) {
                res.redirect(util.format('/blog/%s/%s', trueCateAlias, alias));
            }

            labels = article.Labels;
            if (labels) {
                labels = JSON.parse(labels);
                labels.forEach(lbl => {
                    labelList.push(lbl.text);
                });
            }
            const post = {
                UniqueId: article.UniqueId,
                Title: article.Title,
                CategoryAlias: cateAlias,
                CateName: tool.jsonQuery(categories, { _id: article.CategoryId })
                    .CateName,
                CreateTimeStr: moment(article.CreateTime)
                    .format('YYYY-MM-DD hh:mm'),
                ViewCount: article.ViewCount,
                LabelList: labelList,
                Summary: article.Summary,
                ContentType: article.ContentType
            };
            let resultContent;
            if (article.ContentType === 'markdown') {
                const converter = new showdown.Converter();
                converter.setFlavor('github');
                resultContent = converter.makeHtml(article.Content);
            } else {
                resultContent = article.Content;
            }
            res.render('blog/article', {
                post,
                settings,
                resultContent,
                title: `${settings.SiteName} - ${article.Title}`
            });
        }
    });
});

module.exports = router;
