var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var category = require('../proxy/category');
var tool = require('../utility/tool');

router.get('/', function (req, res, next) {
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
            categories;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            categories = results[1];
            res.render('blog/index', {
                cateData: categories,
                config: settings,
                title: settings['SiteName'],
                currentCate: '',
                isRoot: true
            });
        }
    });
});

module.exports = router;
