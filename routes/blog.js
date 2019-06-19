const express = require('express');
const router = express.Router();
const path = require('path');
const util = require('util');
const category = require('../proxy/category');
const post = require('../proxy/post');
const tool = require('../utility/tool');
const moment = require('moment');
const url = require('url');
const showdown = require('showdown');

// 分类页面
router.get('/:category?', (req, res, next) => {
    const currentCate = req.params.category || '';
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/settings.json')),
        category.getAll()
    ]).then(results => {
        const settings = results[0];
        const categories = results[1];
        const cate = tool.jsonQuery(categories, { Alias: currentCate });
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
    }, err => {
        next(err);
    });
});

// 获取文章数据
router.post('/getPosts', (req, res, next) => {
    category.getByAlias(req.body.CateAlias).then(cate => {
        const params = {
            cateId: cate._id,
            pageIndex: req.body.PageIndex,
            pageSize: req.body.PageSize,
            sortBy: req.body.SortBy,
            keyword: req.body.Keyword,
            filterType: req.body.FilterType
        };
        Promise.all([
            post.getPosts(params),
            post.getPageCount(params),
            category.getAll()
        ]).then(results => {
            const posts = results[0];
            const pageCount = results[1];
            const categories = results[2];
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
            const result = [];
            posts.forEach(post => {
                const obj = {
                    Source: post.Source,
                    Alias: post.Alias,
                    Title: post.Title,
                    Url: post.Url,
                    PublishDate: moment(post.CreateTime)
                        .format('YYYY-MM-DD'),
                    Host: post.Url ? url.parse(post.Url)
                        .host : '',
                    Summary: post.Summary,
                    UniqueId: post.UniqueId,
                    ViewCount: post.ViewCount
                };
                const cateId = post.CategoryId;
                const cateItem = tool.jsonQuery(categories, { _id: cateId });
                if (cateItem) {
                    obj.CategoryAlias = cateItem.Alias;
                    obj.CateName = cateItem.CateName;
                }
                result.push(obj);
            });
            res.json({ posts: result, pageCount });
        });
    }, err => {
        next(err);
    });
});

// 根据文章alias获取预览数据
router.post('/getPreviewContent', (req, res, next) => {
    post.getPostByAlias(req.body.alias).then(data => {
        let resultContent;
        if (data.ContentType === 'markdown') {
            const converter = new showdown.Converter();
            converter.setFlavor('github');
            resultContent = converter.makeHtml(data.Content);
        } else {
            resultContent = data.Content;
        }
        res.json({
            Content: resultContent,
            ContentType: data.ContentType,
            Labels: data.Labels
        });
    }, err => {
        next(err);
    });
});

// 文章详细页
router.get('/:category/:article', (req, res, next) => {
    const alias = req.params.article;
    const cateAlias = req.params.category;
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/settings.json')),
        post.getPostByAlias(alias),
        category.getAll()
    ]).then(results => {
        const settings = results[0];
        const article = results[1];
        const categories = results[2];

        // 如果文章已被删除，且当前不是管理员登录状态，则显示 404
        if (!article.IsActive && !req.user) {
            return next();
        }

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
        const trueCateAlias = tool.jsonQuery(categories, { _id: article.CategoryId })
            .Alias;
        if (cateAlias !== trueCateAlias) {
            res.redirect(util.format('/blog/%s/%s', trueCateAlias, alias));
        }

        const labels = article.Labels;
        const labelList = [];
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
    }, err => {
        next(err);
    });
});

module.exports = router;
