var winston = require('winston');
var dbPath = require('../config').DbPath;
// var dbPath =  process.env.MONGOLAB_URI;
var os = require('os');
require('winston-mongodb').MongoDB;
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true,
            level: 'error',
            handleExceptions: true
        }),
        new (winston.transports.MongoDB)({
            db: dbPath,
            level: 'info', //会记录info、warn、error3个级别的日志
            handleExceptions: true
        })
    ],
    exitOnError: false
});

/**
 * 记录错误日志
 * @param req 请求对象
 * @param err 错误对象
 */
exports.errLogger = function (req, err) {
    var obj = {},
        message = err.message;
    obj.process = {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage()
    };
    obj.os = {
        hostname: os.hostname(),
        loadavg: os.loadavg(),
        uptime: os.uptime()
    };
    obj.stack = err.stack && err.stack.split('\n');
    obj.code = err.status || 500;
    var query = {};
    for (var q in req.query) {
        query[q] = req.query[q];
    }
    obj.req = {
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        query: query,
        body: req.body,
        ip: req.ip,
        route: req.route
    };
    if (!message && obj.code === 404) {
        message = 'not fount "' + req.originalUrl + '"';
    }
    logger.error(message, obj);
};
