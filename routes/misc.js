var express = require('express');
var router = express.Router();
var path = require('path');
var eventproxy = require('eventproxy');
var tool = require('../utility/tool');

router.get('/guestbook', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('misc/guestbook', {
                title: settings['SiteName'] + ' - 留言',
                settings: settings
            });
        }
    });
});

router.get('/about', function (req, res, next) {
    var ep = new eventproxy();
    ep.all('settings', 'about', function (settings, about) {
        res.render('misc/about', {
            title: settings['SiteName'] + ' - 关于',
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

module.exports = router;