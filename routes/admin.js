var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var eventproxy = require('eventproxy');
var upload = require('jquery-file-upload-middleware');
var post = require('../proxy/post');
var category = require('../proxy/category');
var log = require('../proxy/log');
var tool = require('../utility/tool');
var moment = require('moment');
var shortid = require('shortid');
var redisClient = require('../utility/redisClient');

upload.configure({
    uploadDir: path.join(__dirname, '../public/images/'),
    uploadUrl: '/images'
});

router.get('/', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/index', {
                settings: settings,
                title: settings['SiteName'] + ' - 网站统计'
            });
        }
    });
});

router.get('/categorymanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/categorymanage', {
                settings: settings,
                title: settings['SiteName'] + ' - 分类管理'
            });
        }
    });
});

router.post('/getCategories', function (req, res, next) {
    category.getAll(false, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

router.post('/saveCategories', function (req, res, next) {
    var jsonArray = JSON.parse(req.body.json.substr(1, req.body.json.length - 2));
    category.save(jsonArray, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

router.get('/articlemanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/articlemanage', {
                settings: settings,
                title: settings['SiteName'] + ' - 文章管理'
            });
        }
    });
});

router.post('/getCateFilter', function (req, res, next) {
    category.getAll(true, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

router.post('/getArticles', function (req, res, next) {
    var ep = new eventproxy(),
        filter,
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

    ep.all('posts', 'count', 'categories', function (posts, count, categories) {
        var post,
            cateId,
            cateItem,
            result = [];
        posts.forEach(function (item) {
            post = {
                UniqueId: item._id,
                Alias: item.Alias,
                Title: item.Title,
                CreateTime: moment(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
                ModifyTime: moment(item.ModifyTime).format('YYYY-MM-DD HH:mm:ss'),
                Summary: item.Summary,
                ViewCount: item.ViewCount,
                Source: item.Source,
                Url: item.Url,
                IsDraft: item.IsDraft,
                IsActive: item.IsActive
            };
            cateId = item.CategoryId;
            cateItem = tool.jsonQuery(categories, {"_id": cateId});
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
    });

    post.getArticles(params, function (err, posts) {
        if (err) {
            next(err);
        } else {
            ep.emit('posts', posts);
        }
    });

    post.getArticlesCount(params, function (err, count) {
        if (err) {
            next(err);
        } else {
            ep.emit('count', count);
        }
    });

    category.getAll(true, false, function (err, categories) {
        if (err) {
            next(err);
        } else {
            ep.emit('categories', categories);
        }
    });
});

//新的文章页面
router.get('/newArticle', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/newarticle', {
                uniqueId: shortid.generate(),
                settings: settings,
                title: settings['SiteName'] + ' - 新的文章'
            });
        }
    });
});

//检查文章Alias是否唯一
router.post('/checkArticleAlias', function (req, res, next) {
    post.checkAlias(req.body.Alias, req.body.uid, function (err, isValid) {
        if (err) {
            next(err);
        } else {
            res.json({
                valid: isValid
            });
        }
    })
});

//保存文章
router.post('/saveArticle', function (req, res, next) {
    var params = {
        UniqueId: req.body.UniqueId,
        Title: req.body.Title,
        Alias: req.body.Alias,
        Summary: req.body.Summary,
        Source: req.body.Source,
        Content: req.body.Content,
        CategoryId: req.body.CategoryId,
        Labels: req.body.Labels,
        Url: req.body.Url,
        IsDraft: req.body.IsDraft
    };
    post.save(params, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//修改文章
router.get('/editArticle/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        res.redirect('/admin/articlemanage');
    }
    var ep = new eventproxy();
    ep.all('settings', 'article', function (settings, article) {
        res.render('admin/editarticle', {
            settings: settings,
            post: article,
            title: settings['SiteName'] + ' - 编辑文章'
        });
    });

    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            ep.emit('settings', settings);
        }
    });

    post.getById(id, function (err, article) {
        if (err) {
            next(err);
        } else if (!article) {
            next();
        } else {
            ep.emit('article', article);
        }
    })
});

//删除文章
router.post('/deleteArticles', function (req, res, next) {
    post.delete(req.body.ids, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//还原文章
router.post('/undoArticle', function (req, res, next) {
    post.undo(req.body.id, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

router.get('/comments', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/comments', {
                settings: settings,
                title: settings['SiteName'] + ' - 评论管理'
            });
        }
    });
});

router.get('/guestbook', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/guestbook', {
                settings: settings,
                title: settings['SiteName'] + ' - 留言管理'
            });
        }
    });
});

router.get('/aboutmanage', function (req, res, next) {
    var ep = new eventproxy();
    ep.all('settings', 'about', function (settings, about) {
        res.render('admin/aboutmanage', {
            title: settings['SiteName'] + ' - 关于管理',
            about: about,
            settings: settings
        });
    });

    tool.getConfig(path.join(__dirname, '../config/about.json'), function (err, about) {
        if (err) {
            next(err);
        } else {
            ep.emit('about', about);
        }
    });

    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            ep.emit('settings', settings);
        }
    });
});

router.post('/uploadimg', function (req, res, next) {
    upload.fileHandler()(req, res, next);
});

router.post('/saveAbout', function (req, res, next) {
    tool.setConfig(path.join(__dirname, '../config/about.json'), {
        FirstLine: req.body.FirstLine,
        SecondLine: req.body.SecondLine,
        PhotoPath: req.body.PhotoPath,
        ThirdLine: req.body.ThirdLine,
        Profile: req.body.Profile,
        Wechat: req.body.Wechat,
        QrcodePath: req.body.QrcodePath,
        Email: req.body.Email
    });
    res.end();
});

router.get('/cachemanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/cachemanage', {
                settings: settings,
                title: settings['SiteName'] + ' - 缓存管理'
            });
        }
    });
});

router.post('/getcache', function (req, res, next) {
    redisClient.getItem(req.body.key, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data) {
                res.json(data);
            } else {
                res.end();
            }
        }
    })
});

router.post('/clearcache', function (req, res, next) {
    redisClient.removeItem(req.body.key, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

router.get('/exception', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/exception', {
                settings: settings,
                title: settings['SiteName'] + ' - 异常管理'
            });
        }
    });
});

router.post('/getExceptions', function (req, res, next) {
    var ep = new eventproxy(),
        params = {
            pageIndex: req.body.pageNumber,
            pageSize: req.body.pageSize,
            sortName: req.body.sortName,
            sortOrder: req.body.sortOrder
        };

    ep.all('logs', 'count', function (logs, count) {
        var result = [];
        logs.forEach(function (item) {
            result.push({
                message: item.message,
                time: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS'),
                level: item.level,
                meta: item.meta
            });
        });
        res.json({
            rows: result,
            total: count
        });
    });

    log.getAll(params, function (err, logs) {
        if (err) {
            next(err);
        } else {
            ep.emit('logs', logs);
        }
    });

    log.getAllCount(params, function (err, count) {
        if (err) {
            next(err);
        } else {
            ep.emit('count', count);
        }
    })
});

router.get('/settings', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/settings', {
                settings: settings,
                title: settings['SiteName'] + ' - 系统设置'
            });
        }
    });
});

router.post('/saveSettings', function (req, res, next) {
    tool.setConfig(path.join(__dirname, '../config/settings.json'), {
        SiteName: req.body.SiteName,
        SiteDomain: req.body.SiteDomain,
        RecordNo: req.body.RecordNo,
        LogoPath: req.body.LogoPath,
        PageSize: req.body.PageSize,
        ExpandMenu: req.body.ExpandMenu,
        CacheExpired: req.body.CacheExpired,
        TranslateKey: req.body.TranslateKey,
        EnableStatistics: req.body.EnableStatistics,
        StatisticsId: req.body.StatisticsId,
        EnableShare: req.body.EnableShare,
        JiaThisId: req.body.JiaThisId,
        ShowComments: req.body.ShowComments,
        ChangyanId: req.body.ChangyanId,
        ChangyanConf: req.body.ChangyanConf,
        ShowGuestbook: req.body.ShowGuestbook,
        YouyanId: req.body.YouyanId
    });
    res.end();
});

module.exports = router;