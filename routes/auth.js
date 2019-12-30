const express = require('express');
const router = express.Router();
const tool = require('../utility/tool');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local')
    .Strategy;
const serverlog = require('serverlog-node');
const logger = serverlog.getLogger('auth');
const log = require('../proxy/log');

passport.use(new Strategy({
        // 页面上的用户名字段的name属性值
    usernameField: 'UserName',

        // 页面上的密码字段的name属性值
    passwordField: 'Password'
},
    (username, password, cb) => {
        const account = require('../config/account');

        // 自己判断用户是否有效
        if (username === account.UserName && password === account.Password) {
            // 验证通过
            return cb(null, account);
        }

        // 验证失败
        return cb(null, false);
    }));

passport.serializeUser((user, cb) => {
    cb(null, user.Id);
});

passport.deserializeUser((id, cb) => {
    const account = require('../config/account');
    if (account.Id === id) {
        return cb(null, account);
    }
    return cb(err);
});

// 后台登录页面
router.get('/login', (req, res, next) => {
    tool.getConfig(path.join(__dirname, '../config/settings.json')).then(settings => {
        res.render('auth/login', {
            settings,
            title: `${settings.SiteName} - ${res.__('auth.title')}`
        });
    }, err => {
        next(err);
    });
});

// 提交登录请求
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        } else if (!user) {
            log.store('Error', new Error(res.__('auth.wrong_info')));
            logger.error('尝试登录出错！');
            res.json({
                valid: false,
                message: res.__('auth.wrong_info')
            });
        } else {
            // 登录操作
            req.logIn(user, err => {
                if (err) {
                    next(err);
                } else {
                    // 优先跳转之前的页面
                    let returnTo = '/admin';
                    if (req.session.returnTo) {
                        returnTo = req.session.returnTo;
                    }
                    res.json({
                        valid: true,
                        returnTo
                    });
                }
            });
        }
    })(req, res, next);
});

// 退出登录
router.post('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/login');
    });

module.exports = router;
