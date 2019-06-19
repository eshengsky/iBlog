var redis = require('redis');
var config = require('../config');
var redisEnable = config.redis.enable;

if (redisEnable) {
    // use custom redis url or localhost
    var client = redis.createClient(config.redis.port || 6379, config.redis.host || 'localhost');
    client.on('error', function (err) {
        console.error('Redis连接错误: ' + err);
        process.exit(1);
    });
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 */
exports.setItem = (key, value, expired) => {
    return new Promise((resolve, reject) => {
        if (!redisEnable) {
            return resolve();
        }
    
        client.set(key, JSON.stringify(value), err => {
            if (err) {
                return reject(err);
            }
            if (expired) {
                client.expire(key, expired);
            }
            return resolve();
        });
    });
    
};

/**
 * 获取缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.getItem = key => {
    return new Promise((resolve, reject) => {
        if (!redisEnable) {
            return resolve(null);
        }
    
        client.get(key, function (err, reply) {
            if (err) {
                return reject(err);
            }
            return resolve(JSON.parse(reply));
        });
    });
};

/**
 * 移除缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.removeItem = key => {
    return new Promise((resolve, reject) => {
        if (!redisEnable) {
            return resolve();
        }
    
        client.del(key, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};

/**
 * 获取默认过期时间，单位秒
 */
exports.defaultExpired = parseInt(require('../config/settings').CacheExpired);
