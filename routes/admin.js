const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
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
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/index', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.web_statistic')}`
        });
    }, err => {
        next(err);
    });
});

// 分类管理页面
router.get('/categorymanage', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/categorymanage', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.classified_management')}`
        });
    }, err => {
        next(err);
    });
});

// 获取分类数据，不走缓存
router.post('/getCategories', (req, res, next) => {
    category.getAll(false).then(data => {
        res.json(data);
    }, err => {
        next(err);
    });
});

// 保存分类数据
router.post('/saveCategories', (req, res, next) => {
    const jsonArray = JSON.parse(req.body.json.substr(1, req.body.json.length - 2));
    category.save(jsonArray).then(() => {
        res.end();
    }, err => {
        next(err);
    });
});

// 文章管理页面
router.get('/articlemanage', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/articlemanage', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.article_management')}`
        });
    }, err => {
        next(err);
    });
});

// 获取分类数据，不走缓存
router.post('/getCateFilter', (req, res, next) => {
    category.getAll(false).then(data => {
        res.json(data);
    }, err => {
        next(err);
    });
});

// 获取文章列表数据
router.post('/getArticles', (req, res, next) => {
    const params = {
        pageIndex: req.body.pageNumber,
        pageSize: req.body.pageSize,
        sortName: req.body.sortName,
        sortOrder: req.body.sortOrder,
        searchText: req.body.searchText
    };
    if (req.body.filter) {
        const filter = JSON.parse(req.body.filter);
        params.cateId = filter.CateName;
        params.uniqueId = filter.UniqueId;
        params.title = filter.Title;
    }
    Promise.all([
        post.getArticles(params),
        post.getArticlesCount(params),
        category.getAll(false)
    ]).then(results => {
        const posts = results[0];
        const count = results[1];
        const categories = results[2];
        const result = [];
        posts.forEach(item => {
            const post = {
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
            const cateId = item.CategoryId;
            let cateItem;
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
    }, err => {
        next(err);
    });
});

// 新的文章页面
router.get('/newArticle', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/newarticle', {
            uniqueId: shortid.generate(),
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.new_article')}`
        });
    }, err => {
        next(err);
    });
});

// 检查文章Alias是否唯一
router.post('/checkArticleAlias', (req, res, next) => {
    post.checkAlias(req.body.Alias, req.body.uid).then(isValid => {
        res.json({
            valid: isValid
        });
    }, err => {
        next(err);
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
    post.save(params).then(() => {
        res.end();
    }, err => {
        next(err);
    });
});

// 修改文章
router.get('/editArticle/:id', (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.redirect('/admin/articlemanage');
    }
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/settings.json')),
        post.getById(id)
    ]).then(results => {
        const settings = results[0];
        const article = results[1];
        res.render('admin/editarticle', {
            settings,
            post: article,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.edit_article')}`
        });
    }, err => {
        next(err);
    });
});

// 删除文章
router.post('/deleteArticles', (req, res, next) => {
    post.delete(req.body.ids).then(() => {
        res.end();
    }, err => {
        next(err);
    });
});

// 还原文章
router.post('/undoArticle', (req, res, next) => {
    post.undo(req.body.id).then(() => {
        res.end();
    }, err => {
        next(err);
    });
});

// 评论管理页面
router.get('/comments', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/comments', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.comment_management')}`
        });
    }, err => {
        next(err);
    });
});

// 留言管理页面
router.get('/guestbook', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/guestbook', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.msg_management')}`
        });
    }, err => {
        next(err);
    });
});

// 关于管理页面
router.get('/aboutmanage', (req, res, next) => {
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/about.json')),
        tool.getConfig(path.join(__dirname, '../config/settings.json'))
    ]).then(results => {
        const about = results[0];
        const settings = results[1];
        res.render('admin/aboutmanage', {
            title: `${settings.SiteName} - ${res.__('layoutAdmin.about_management')}`,
            about,
            settings
        });
    }, err => {
        next(err);
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
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/cachemanage', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.cache_management')}`
        });
    }, err => {
        next(err);
    });
});

// 根据缓存key获取缓存
router.post('/getcache', (req, res, next) => {
    redisClient.getItem(req.body.key).then(data => {
        if (data) {
            res.json(data);
        } else {
            res.end();
        }
    }, err => {
        next(err);
    });
});

// 清除指定key的缓存
router.post('/clearcache', (req, res, next) => {
    redisClient.removeItem(req.body.key).then(() => {
        res.end();
    }, err => {
        next(err);
    });
});

// 异常管理页面
router.get('/exception', require('connect-ensure-login')
    .ensureLoggedIn(),
    (req, res, next) => {
        tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
            res.render('admin/exception', {
                settings,
                title: `${settings.SiteName} - ${res.__('layoutAdmin.exception_management')}`
            });
        }, err => {
            next(err);
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
    Promise.all([
        log.getAll(params),
        log.getAllCount(params)
    ]).then(results => {
        const result = [];
        const logs = results[0];
        const count = results[1];
        logs.forEach(item => {
            result.push({
                message: item.message,
                time: moment(item.timestamp)
                    .format('YYYY-MM-DD HH:mm:ss.SSS'),
                level: item.level,
                ip:item.ip,
                meta: item.meta
            });
        });
        res.json({
            rows: result,
            total: count
        });
    }, err => {
        next(err);
    });
});

// 系统设置页面
router.get('/settings', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('admin/settings', {
            settings,
            title: `${settings.SiteName} - ${res.__('layoutAdmin.settings')}`
        });
    }, err => {
        next(err);
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
        ShowArticleSign: req.body.ShowArticleSign,
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
        Email: req.body.EmailAddr,
        Author: req.body.AuthorName,
        CodeTheme: req.body.CodeTheme
    });
    res.end();
});

module.exports = router;
