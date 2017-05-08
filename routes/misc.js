var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var tool = require('../utility/tool');

//留言页面
router.get('/guestbook', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('misc/guestbook', {
                title: settings['SiteName'] + ' - ' + res.__("misc.msg"),
                config: settings
            });
        }
    });
});

//关于页面
router.get('/about', function (req, res, next) {
    async.parallel([
        //获取关于数据
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/about.json'), function (err, about) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, about);
                }
            });
        },
        //获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        }
    ], function (err, results) {
        var about,
            settings;
        if (err) {
            next(err);
        } else {
            about = results[0];
            settings = results[1];
            res.render('misc/about', {
                title: settings['SiteName'] + ' - ' + res.__('misc.about'),
                about: about,
                config: settings
            });
        }
    });
});

module.exports = router;
