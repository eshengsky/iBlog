var dbPath = require('../config').DbPath;
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
mongoose.connect(dbPath);
var db = mongoose.connection;
db.on('error', function (err) {
    console.error('MongoDB连接错误: ' + err);
    process.exit(1);
});
exports.mongoose = mongoose;

//基础Schema
var base = new mongoose.Schema({
    //唯一键
    _id: {type: String, unique: true},
    //创建时间
    CreateTime: {type: Date},
    //修改时间
    ModifyTime: {type: Date}
});
exports.base = base;