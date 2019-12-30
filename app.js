const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const route = require('./routes/index');
const blog = require('./routes/blog');
const misc = require('./routes/misc');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const locale = require('./routes/locale');
const ue = require('./routes/ue');
const tool = require('./utility/tool');
const passport = require('passport');
const i18n = require('./models/i18n');
const serverlog = require('serverlog-node');
serverlog.config({
    extension: {
        enable: true,
        key: 'iblog2_server_log_key'
    }
});
const logger = serverlog.getLogger('app');
const log = require('./proxy/log');
const app = express();

/**
 * 记录未捕获异常
 */
process.on('uncaughtException', err => {
    log.store('Error', err);
    logger.error(err);
});

/**
 * 记录未处理的Promise失败
 */
process.on('unhandledRejection', reason => {
    log.store('Error', reason);
    logger.error(reason);
});

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 在模板页面可以使用 staticPrefix 变量以区别本地开发环境和线上环境引入不同的资源文件
app.locals.staticPrefix = app.get('env') === 'production' ? '/static/dist' : '/static/src';

// 增加安全性头部
app.use(helmet());

// 注册 ServerLog 中间件以注入 req 对象给日志
app.use(serverlog.middleware());

// 记录所有请求
app.use((req, res, next) => {
    logger.info(`${req.method.toUpperCase()} ${tool.getFullUrl(req)}`);
    next();
});

// 网站 Icon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// parse body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// parse cookie
app.use(cookieParser());

// 多语言
app.use(i18n.init);

// 设置 Session
app.use(session({
    secret: 'iblog-exp-session',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 静态文件
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/nodeModules', express.static(path.join(__dirname, 'node_modules')));

// Service Worker
app.get('/sw.js', (req, res) => {
    fs.readFile(path.resolve(__dirname, './sw.js'), (err, data) => {
        if (err) {
            logger.error(err);
            throw err;
        }
        res.writeHead(200, {
            'Content-type': 'text/javascript'
        });
        res.end(data);
    });
});

// 前台站点路由，无需登录
app.use('/', route);
app.use('/', locale);
app.use('/', misc);
app.use('/', auth);
app.use('/blog', blog);
app.use('/ue/controller', ue);

// 后台站点路由，需要身份验证
app.use('/admin', require('connect-ensure-login')
    .ensureLoggedIn('/login'), admin);

// 捕获 404
app.use((req, res) => {
    const err = new Error(`Not Found! URL: ${req.originalUrl}`);
    err.status = 404;
    log.store('Warn', err);
    logger.warn(`Not Found! URL: ${req.originalUrl}`);
    res.status(404)
        .render('./shared/error', {
            code: 404,
            message: res.__('error.404_1')
        });
});

// 捕获 500
app.use((err, req, res) => {
    const code = err.status || 500;
    err.status = code;
    log.store('Error', err);
    logger.error(err);
    res.status(code)
        .render('./shared/error', {
            code,
            message: res.__('error.404_2')
        });
});

module.exports = app;
