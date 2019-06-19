const express = require('express');
const router = express.Router();
const path = require('path');
const category = require('../proxy/category');
const tool = require('../utility/tool');

router.get('/', (req, res, next) => {
    Promise.all([
        tool.getConfig(path.join(__dirname, '../config/settings.json')),
        category.getAll()
    ]).then(results => {
        const settings = results[0];
        const categories = results[1];
        res.render('blog/index', {
            cateData: categories,
            settings,
            title: settings.SiteName,
            currentCate: '',
            isRoot: true
        });
    }, err => {
        next(err);
    });
});

module.exports = router;
