const express = require('express');
const router = express.Router();
const path = require('path');
const async = require('async');
const tool = require('../utility/tool');

// 留言页面
router.get('/guestbook', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), (err, settings) => {
        if (err) {
            next(err);
        } else {
            if (settings.ShowGuestbook !== 'true') {
                return next();
            }
            res.render('misc/guestbook', {
                title: `${settings.SiteName} - ${res.__('misc.msg')}`,
                settings
            });
        }
    });
});

// 关于页面
router.get('/about', (req, res, next) => {
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
        let about,
            settings;
        if (err) {
            next(err);
        } else {
            about = results[0];
            settings = results[1];
            res.render('misc/about', {
                title: `${settings.SiteName} - ${res.__('misc.about')}`,
                about,
                settings
            });
        }
    });
});

module.exports = router;
