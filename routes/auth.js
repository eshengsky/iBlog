var express = require('express');
var router = express.Router();
var tool = require('../utility/tool');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var logger = require('../utility/logger');

passport.use(new Strategy(
    {
        usernameField: 'UserName',
        passwordField: 'Password'
    },
    function (username, password, cb) {
        var account = require('../config/account');
        if (username === account.UserName && password === account.Password) {
            return cb(null, account);
        } else {
            return cb(null, false);
        }
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.Id);
});

passport.deserializeUser(function (id, cb) {
    var account = require('../config/account');
    if (account.Id === id) {
        return cb(null, account);
    } else {
        return cb(err);
    }
});

router.get('/login', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('auth/login', {
                settings: settings,
                title: settings['SiteName'] + ' - 后台登录'
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            next(err);
        } else if (!user) {
            logger.errLogger(req, new Error('管理员登录失败。'));
            res.json({
                valid: false,
                message: '用户名或密码错误！'
            });
        } else {
            req.logIn(user, function (err) {
                var returnTo = '/admin';
                if (err) {
                    next(err);
                } else {
                    if (req.session.returnTo) {
                        returnTo = req.session.returnTo;
                    }
                    res.json({
                        valid: true,
                        returnTo: returnTo
                    });
                }
            });
        }
    })(req, res, next);
});

router.post('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/login');
    });

module.exports = router;