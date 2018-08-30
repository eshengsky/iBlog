const winston = require('winston');
const dbPath = require('../config.json')
    .mongoUrl;
const os = require('os');
require('winston-mongodb')
    .MongoDB;

const logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.MongoDB)({
            db: dbPath,
            level: 'warn',
        })
    ],
    exitOnError: false
});

logger.errLogger = function (err, req) {
    let obj = {},
        message = err.message;
    obj.process = {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null
    };
    obj.os = {
        hostname: os.hostname()
    };
    obj.stack = err.stack && err.stack.split('\n');
    obj.code = err.status || 500;
    if (req) {
        const query = {};
        for (const q in req.query) {
            query[q] = req.query[q];
        }
        obj.req = {
            baseUrl: req.baseUrl,
            originalUrl: req.originalUrl,
            query,
            body: req.body,
            ip: req.ip,
            route: req.route
        };
    }
    logger.error(message, obj);
};

module.exports = logger;
