const express = require('express');
const router = express.Router();
const path = require('path');
const tool = require('../utility/tool');

// 留言页面
router.get('/guestbook', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        if (settings.ShowGuestbook !== 'true') {
            return next();
        }
        res.render('misc/guestbook', {
            title: `${settings.SiteName} - ${res.__('misc.msg')}`,
            settings
        });
    }, err => {
        next(err);
    });
});

// 关于页面
router.get('/about', (req, res, next) => {
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/about.json')),
        tool.getConfig(path.join(__dirname, '../config/settings.json'))
    ]).then(results => {
        const about = results[0];
        const settings = results[1];
        res.render('misc/about', {
            title: `${settings.SiteName} - ${res.__('misc.about')}`,
            about,
            settings
        });
    }, err => {
        next(err);
    });
});

module.exports = router;
