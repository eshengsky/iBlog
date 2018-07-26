const fs = require('fs');
module.exports = {
    /**
     * 获取完整URL
     * @param {object} req - request
     * @returns
     */
    getFullUrl(req) {
        return `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    },

    /**
     * 搜索JSON数组
     * @param jsonArray - JSON数组
     * @param conditions - 查询条件，如 {"name":"value"}
     * @returns {Object} - 匹配的JSON对象
     */
    jsonQuery(jsonArray, conditions) {
        let i = 0,
            len = jsonArray.length,
            json,
            condition,
            flag;
        for (; i < len; i++) {
            flag = true;
            json = jsonArray[i];
            for (condition in conditions) {
                if (json[condition] !== conditions[condition]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                return json;
            }
        }
    },

    /**
     * 读取配置文件
     * @param filePath - 文件路径
     * @param [key] - 要读取的配置项key
     * @param callback - 回调函数
     */
    getConfig(filePath, key, callback) {
        if (typeof key === 'function') {
            callback = key;
            key = undefined;
        }
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                console.log(`读取文件%s出错：${err}`, filePath);
                return callback(err);
            }
            let data = JSON.parse(file);
            if (typeof key === 'string') {
                data = data[key];
            }
            return callback(null, data);
        });
    },

    /**
     * 写入配置文件
     * @param filePath - 文件路径
     * @param setters - 要写入的对象
     */
    setConfig(filePath, setters) {
        fs.readFile(filePath, 'utf8', (err, file) => {
            let data = JSON.parse(file),
                key;
            for (key in setters) {
                data[key] = setters[key];
            }
            const newFile = JSON.stringify(data, null, 2);
            fs.writeFile(filePath, newFile, 'utf8');
        });
    },

    /**
     * 根据对象的属性和值拼装key
     * @param [prefix] - key前缀
     * @param obj - 待解析对象
     * @returns {string} - 拼装的key，带前缀的形如：prefix_name_Tom_age_20，不带前缀的形如：name_Tom_age_20
     */
    generateKey(prefix, obj) {
        if (typeof prefix === 'object') {
            obj = prefix;
            prefix = undefined;
        }
        let attr,
            value,
            key = '';
        for (attr in obj) {
            value = obj[attr];

            // 形如： _name_Tom
            key += `_${attr.toString()
                .toLowerCase()}_${value.toString()}`;
        }
        if (prefix) {
            // 形如：prefix_name_Tom_age_20
            key = prefix + key;
        } else {
            // 形如：name_Tom_age_20
            key = key.substr(1);
        }
        return key;
    }
};
