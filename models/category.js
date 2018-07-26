const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;

const categorySchema = base.extend({
    // 分类名称
    CateName: { type: String },

    // 分类别名
    Alias: { type: String },

    // 图标地址
    Img: { type: String },

    // 链接地址
    Link: { type: String }
});

exports.CategoryModel = mongoose.model('category', categorySchema, 'category');
