var dbPath = require('../config').DbPath;
// var dbPath =  process.env.MONGOLAB_URI;
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var i18n = require('./i18n');
// use custom mongodb url or localhost
mongoose.connect(dbPath || "mongodb://localhost/blogrift");
var db = mongoose.connection;
db.on('error', function (err) {
    console.error(i18n.__('error.db_1') + err);
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
