const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const async = require('async');
const upload = require('jquery-file-upload-middleware');
const post = require('../proxy/post');
const category = require('../proxy/category');
const log = require('../proxy/log');
const tool = require('../utility/tool');
const moment = require('moment');
const shortid = require('shortid');
const redisClient = require('../utility/redisClient');

// 上传配置
upload.configure({
    uploadDir: path.join(__dirname, '../public/images/'),
    uploadUrl: '/static/images'
});

// 网站统计页面
router.get('/', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/index', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.web_statistic')}`
            });
        }
    });
});

// 分类管理页面
router.get('/categorymanage', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/categorymanage', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.classified_management')}`
            });
        }
    });
});

// 获取分类数据，不走缓存
router.post('/getCategories', (req, res, next) => {
    category.getAll(false, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

// 保存分类数据
router.post('/saveCategories', (req, res, next) => {
    const jsonArray = JSON.parse(req.body.json.substr(1, req.body.json.length - 2));
    category.save(jsonArray, err => {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

// 文章管理页面
router.get('/articlemanage', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/articlemanage', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.article_management')}`
            });
        }
    });
});

// 获取分类数据，不走缓存
router.post('/getCateFilter', (req, res, next) => {
    category.getAll(false, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

// 获取文章列表数据
router.post('/getArticles', (req, res, next) => {
    let filter,
        params = {
            pageIndex: req.body.pageNumber,
            pageSize: req.body.pageSize,
            sortName: req.body.sortName,
            sortOrder: req.body.sortOrder,
            searchText: req.body.searchText
        };
    if (req.body.filter) {
        filter = JSON.parse(req.body.filter);
        params.cateId = filter.CateName;
        params.uniqueId = filter.UniqueId;
        params.title = filter.Title;
    }
    async.parallel([
        // 获取文章列表
        function (cb) {
            post.getArticles(params, (err, posts) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, posts);
                }
            });
        },

        // 获取文章总数
        function (cb) {
            post.getArticlesCount(params, (err, count) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            });
        },

        // 获取分类
        function (cb) {
            category.getAll(false, (err, categories) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], (err, results) => {
        let posts,
            count,
            categories,
            post,
            cateId,
            cateItem,
            result = [];
        if (err) {
            next(err);
        } else {
            posts = results[0];
            count = results[1];
            categories = results[2];
            posts.forEach(item => {
                post = {
                    UniqueId: item._id,
                    Alias: item.Alias,
                    Title: item.Title,
                    CreateTime: moment(item.CreateTime)
                        .format('YYYY-MM-DD HH:mm:ss'),
                    ModifyTime: moment(item.ModifyTime)
                        .format('YYYY-MM-DD HH:mm:ss'),
                    Summary: item.Summary,
                    ViewCount: item.ViewCount,
                    Source: item.Source,
                    Url: item.Url,
                    IsDraft: item.IsDraft,
                    IsActive: item.IsActive
                };
                cateId = item.CategoryId;
                if (!cateId) {
                    cateItem = {
                        _id: '',
                        Alias: '',
                        CateName: res.__('Category.all'),
                        Img: '/static/images/全部分类.svg'
                    };
                } else if (cateId === 'other') {
                    cateItem = {
                        _id: 'other',
                        Alias: 'other',
                        CateName: res.__('Category.uncate'),
                        Img: '/static/images/未分类.svg'
                    };
                } else {
                    cateItem = tool.jsonQuery(categories, { _id: cateId });
                }
                if (cateItem) {
                    post.CategoryAlias = cateItem.Alias;
                    post.CateName = cateItem.CateName;
                }
                result.push(post);
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
});

// 新的文章页面
router.get('/newArticle', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/newarticle', {
                uniqueId: shortid.generate(),
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.new_article')}`
            });
        }
    });
});

// 检查文章Alias是否唯一
router.post('/checkArticleAlias', (req, res, next) => {
    post.checkAlias(req.body.Alias, req.body.uid, (err, isValid) => {
        if (err) {
            next(err);
        } else {
            res.json({
                valid: isValid
            });
        }
    });
});

// 保存文章
router.post('/saveArticle', (req, res, next) => {
    const params = {
        UniqueId: req.body.UniqueId,
        Title: req.body.Title,
        Alias: req.body.Alias,
        Summary: req.body.Summary,
        Source: req.body.Source,
        Content: req.body.Content,
        ContentType: req.body.ContentType,
        CategoryId: req.body.CategoryId,
        Labels: req.body.Labels,
        Url: req.body.Url,
        IsDraft: req.body.IsDraft,
        IsActive: req.body.IsActive
    };
    post.save(params, err => {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

// 修改文章
router.get('/editArticle/:id', (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        res.redirect('/admin/articlemanage');
    }
    async.parallel([
        // 获取分类
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },

        // 根据文章Id获取文章
        function (cb) {
            post.getById(id, (err, article) => {
                if (err) {
                    cb(err);
                } else if (!article) {
                    next();
                } else {
                    cb(null, article);
                }
            });
        }
    ], (err, results) => {
        let settings,
            article;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            article = results[1];
            res.render('admin/editarticle', {
                settings,
                post: article,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.edit_article')}`
            });
        }
    });
});

// 删除文章
router.post('/deleteArticles', (req, res, next) => {
    post.delete(req.body.ids, err => {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

// 还原文章
router.post('/undoArticle', (req, res, next) => {
    post.undo(req.body.id, err => {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

// 评论管理页面
router.get('/comments', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/comments', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.comment_management')}`
            });
        }
    });
});

// 留言管理页面
router.get('/guestbook', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/guestbook', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.msg_management')}`
            });
        }
    });
});

// 关于管理页面
router.get('/aboutmanage', (req, res, next) => {
    async.parallel([
        // 获取关于数据
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/about.json'), (err, about) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, about);
                }
            });
        },

        // 获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        }
    ], (err, results) => {
        let settings,
            about;
        if (err) {
            next(err);
        } else {
            about = results[0];
            settings = results[1];
            res.render('admin/aboutmanage', {
                title: `${settings.SiteName} - ${res.__('layoutAdmin.about_management')}`,
                about,
                settings
            });
        }
    });
});

// 上传图片
router.post('/uploadimg', (req, res, next) => {
    upload.fileHandler()(req, res, next);
});

// 保存关于数据
router.post('/saveAbout', (req, res, next) => {
    tool.setConfig(path.join(__dirname, '../config/about.json'), {
        FirstLine: req.body.FirstLine,
        SecondLine: req.body.SecondLine,
        PhotoPath: req.body.PhotoPath,
        ThirdLine: req.body.ThirdLine,
        Profile: req.body.Profile,
        Github: req.body.Github,
        Email: req.body.Email
    });
    res.end();
});

// 缓存管理页面
router.get('/cachemanage', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/cachemanage', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.cache_management')}`
            });
        }
    });
});

// 根据缓存key获取缓存
router.post('/getcache', (req, res, next) => {
    redisClient.getItem(req.body.key, (err, data) => {
        if (err) {
            next(err);
        } else {
            if (data) {
                res.json(data);
            } else {
                res.end();
            }
        }
    });
});

// 清除指定key的缓存
router.post('/clearcache', (req, res, next) => {
    redisClient.removeItem(req.body.key, err => {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

// 异常管理页面
router.get('/exception', require('connect-ensure-login')
    .ensureLoggedIn(),
    (req, res, next) => {
        tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
            if (err) {
                next(err);
            } else {
                res.render('admin/exception', {
                    settings,
                    title: `${settings.SiteName} - ${res.__('layoutAdmin.exception_management')}`
                });
            }
        });
    });

// 获取异常数据
router.post('/getExceptions', (req, res, next) => {
    const params = {
        pageIndex: req.body.pageNumber,
        pageSize: req.body.pageSize,
        sortName: req.body.sortName,
        sortOrder: req.body.sortOrder
    };
    async.parallel([
        // 获取异常列表
        function (cb) {
            log.getAll(params, (err, logs) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, logs);
                }
            });
        },

        // 获取异常数据总数
        function (cb) {
            log.getAllCount(params, (err, count) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            });
        }
    ], (err, results) => {
        let logs,
            count,
            result = [];
        if (err) {
            next(err);
        } else {
            logs = results[0];
            count = results[1];
            logs.forEach(item => {
                result.push({
                    message: item.message,
                    time: moment(item.timestamp)
                        .format('YYYY-MM-DD HH:mm:ss.SSS'),
                    level: item.level,
                    meta: item.meta
                });
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
});

// 系统设置页面
router.get('/settings', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('admin/settings', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.settings')}`
            });
        }
    });
});

// 保存系统设置
router.post('/saveSettings', (req, res, next) => {
    tool.setConfig(path.join(__dirname, '../config/settings.json'), {
        SiteName: req.body.SiteName,
        SiteDomain: req.body.SiteDomain,
        RecordNo: req.body.RecordNo,
        LogoPath: req.body.LogoPath,
        PageSize: req.body.PageSize,
        ExpandMenu: req.body.ExpandMenu,
        ShowArticleSign:req.body.ShowArticleSign,
        Editor: req.body.Editor,
        CacheExpired: req.body.CacheExpired,
        TranslateKey: req.body.TranslateKey,
        EnableStatistics: req.body.EnableStatistics,
        StatisticsId: req.body.StatisticsId,
        EnableShare: req.body.EnableShare,
        JiaThisId: req.body.JiaThisId,
        ShowComments: req.body.ShowComments,
        ShowGuestbook: req.body.ShowGuestbook,
        ChangyanId: req.body.ChangyanId,
        ChangyanConf: req.body.ChangyanConf,
        Email:req.body.EmailAddr,
        Author:req.body.AuthorName,
        CodeTheme:req.body.CodeTheme
    });
    res.end();
});

module.exports = router;
