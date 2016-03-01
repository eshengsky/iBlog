var express = require('express');
var router = express.Router();
var path = require('path');
var eventproxy = require('eventproxy');
var category = require('../proxy/category');
var tool = require('../utility/tool');

router.get('/', function (req, res, next) {
    var ep = new eventproxy();

    ep.all('settings', 'categories', function (settings, categories) {
        res.render('blog/index', {
            cateData: categories,
            settings: settings,
            title: settings['SiteName'],
            currentCate: '',
            isRoot: true
        });
    });

    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            ep.emit('settings', settings);
        }
    });

    category.getAll(function (err, categories) {
        if (err) {
            next(err);
        } else {
            ep.emit('categories', categories);
        }
    });
});

module.exports = router;
