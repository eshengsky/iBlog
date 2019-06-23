const shortid = require('shortid');
const logModel = require('../models/log')
    .LogModel;

/**
 * 获取所有日志
 * @param params 参数对象
 */
exports.getAll = params => {
    let page = parseInt(params.pageIndex) || 1;
    const size = parseInt(params.pageSize) || 10;
    page = page > 0 ? page : 1;
    const options = {};
    options.skip = (page - 1) * size;
    options.limit = size;
    switch (params.sortName) {
        case 'level':
            options.sort = params.sortOrder === 'desc' ? '-level -timestamp' : 'level timestamp';
            break;
        default:
            options.sort = params.sortOrder === 'desc' ? '-timestamp' : 'timestamp';
            break;
    }
    return new Promise((resolve, reject) => {
        logModel.find({}, {}, options, (err, logs) => {
            if (err) {
                return reject(err);
            }
            return resolve(logs);
        });
    });
    
};

/**
 * 获取日志数
 */
exports.getAllCount = () => {
    return new Promise((resolve, reject) => {
        logModel.count((err, count) => {
            if (err) {
                return reject(err);
            }
            return resolve(count);
        });
    });
};

/**
 * 持久化日志
 */
exports.store = (level, err) => {
    const newLog = new logModel({
        _id: shortid.generate(),
        level,
        message: err.message || '未知错误',
        meta: err,
        timestamp: new Date()
    });
    newLog.save(err => {
        if (err) {
            return console.error(err);
        }
    });
}