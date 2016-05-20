var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var route = require('./routes/index');
var blog = require('./routes/blog');
var misc = require('./routes/misc');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var locale = require('./routes/locale');
var ue = require('./routes/ue');
var logger = require('./utility/logger');
var passport = require('passport');
var i18n = require('./models/i18n');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);

app.use(session({
    secret: 'iblog-exp-session',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', route);
app.use('/', locale);
app.use('/', misc);
app.use('/', auth);
app.use('/blog', blog);
app.use('/admin', require('connect-ensure-login').ensureLoggedIn('/login'), admin);
app.use('/ue/controller', ue);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    var code = err.status || 500,
        message = code === 404 ? res.__('error.404_1') : res.__('error.404_2');
    res.status(code);
    logger.errLogger(req, err);
    res.render('./shared/error', {
        code: code,
        message: message
    });
});

module.exports = app;
