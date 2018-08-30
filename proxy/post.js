const postModel = require('../models/post')
    .PostModel;
const redisClient = require('../utility/redisClient');
const tool = require('../utility/tool');

/**
 * 为首页数据查询构建条件对象
 * @param params 查询参数对象
 * @returns {{}}
 */
function getPostsQuery(params) {
    const query = {};
    query.IsActive = true;
    query.IsDraft = false;
    if (params.cateId) {
        query.CategoryId = params.cateId;
    }
    if (params.keyword) {
        switch (params.filterType) {
            case '1':
                query.Title = { $regex: params.keyword, $options: 'gi' };
                break;
            case '2':
                query.Labels = { $regex: params.keyword, $options: 'gi' };
                break;
            case '3':
                query.CreateTime = { $regex: params.keyword, $options: 'gi' };
                break;
            default:
                query.$or = [{
                    Title: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    Labels: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    Summary: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    Content: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }];
        }
    }
    return query;
}

/**
 * 获取首页的文章数据
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.getPosts = function (params, callback) {
    const cache_key = tool.generateKey('posts', params);
    redisClient.getItem(cache_key, (err, posts) => {
        if (err) {
            return callback(err);
        }
        if (posts) {
            return callback(null, posts);
        }
        let page = parseInt(params.pageIndex) || 1;
        const size = parseInt(params.pageSize) || 10;
        page = page > 0 ? page : 1;
        const options = {};
        options.skip = (page - 1) * size;
        options.limit = size;
        options.sort = params.sortBy === 'title' ? 'Title -CreateTime' : '-CreateTime';
        const query = getPostsQuery(params);
        postModel.find(query, {}, options, (err, posts) => {
            if (err) {
                return callback(err);
            }
            if (posts) {
                redisClient.setItem(cache_key, posts, redisClient.defaultExpired, err => {
                    if (err) {
                        return callback(err);
                    }
                });
            }
            return callback(null, posts);
        });
    });
};

/**
 * 获取首页文章的页数
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.getPageCount = function (params, callback) {
    const cache_key = tool.generateKey('posts_count', params);
    redisClient.getItem(cache_key, (err, pageCount) => {
        if (err) {
            return callback(err);
        }
        if (pageCount) {
            return callback(null, pageCount);
        }
        const query = getPostsQuery(params);
        postModel.count(query, (err, count) => {
            if (err) {
                return callback(err);
            }
            const pageCount = count % params.pageSize === 0 ? parseInt(count / params.pageSize) : parseInt(count / params.pageSize) + 1;
            redisClient.setItem(cache_key, pageCount, redisClient.defaultExpired, err => {
                if (err) {
                    return callback(err);
                }
            });
            return callback(null, pageCount);
        });
    });
};

/**
 * 根据alias获取文章
 * @param alias 文章alias
 * @param callback 回调函数
 */
exports.getPostByAlias = function (alias, callback) {
    const cache_key = `article_${alias}`;
    postModel.update({ Alias: alias }, { $inc: { ViewCount: 1 } })
        .exec();
    redisClient.getItem(cache_key, (err, article) => {
        if (err) {
            return callback(err);
        }
        if (article) {
            return callback(null, article);
        }
        postModel.findOne({ Alias: alias }, (err, article) => {
            if (err) {
                return callback(err);
            }
            if (article) {
                redisClient.setItem(cache_key, article, redisClient.defaultExpired, err => {
                    if (err) {
                        return callback(err);
                    }
                });
            }
            return callback(null, article);
        });
    });
};

/**
 * 为后台数据查询构建条件对象
 * @param params
 * @returns {{}}
 */
function getArticlesQuery(params) {
    const query = {};
    if (params.cateId) {
        query.CategoryId = params.cateId;
    }
    if (params.uniqueId) {
        query._id = params.uniqueId;
    }
    if (params.title) {
        query.Title = { $regex: params.title, $options: 'gi' };
    }
    if (params.searchText) {
        query.$or = [{
            Alias: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }, {
            Title: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }, {
            Summary: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }, {
            Content: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }, {
            Labels: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }, {
            Url: {
                $regex: params.searchText,
                $options: 'gi'
            }
        }];
    }
    return query;
}

/**
 * 获取管理页面的文章数据
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.getArticles = function (params, callback) {
    let page = parseInt(params.pageIndex) || 1;
    const size = parseInt(params.pageSize) || 10;
    page = page > 0 ? page : 1;
    const options = {};
    options.skip = (page - 1) * size;
    options.limit = size;
    switch (params.sortName) {
        case 'ModifyTime':
            options.sort = params.sortOrder === 'desc' ? '-ModifyTime -CreateTime' : 'ModifyTime CreateTime';
            break;
        case 'ViewCount':
            options.sort = params.sortOrder === 'desc' ? '-ViewCount -CreateTime' : 'ViewCount CreateTime';
            break;
        default:
            options.sort = params.sortOrder === 'desc' ? '-CreateTime' : 'CreateTime';
            break;
    }
    const query = getArticlesQuery(params);
    postModel.find(query, {}, options, (err, posts) => {
        if (err) {
            return callback(err);
        }
        return callback(null, posts);
    });
};

/**
 * 获取管理页面的文章数
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.getArticlesCount = function (params, callback) {
    const query = getArticlesQuery(params);
    postModel.count(query, (err, count) => {
        if (err) {
            return callback(err);
        }
        return callback(null, count);
    });
};

/**
 * 判断文章Alias是否唯一
 * @param alias 文章Alias
 * @param articleId 文章Id
 * @param callback 回调函数
 */
exports.checkAlias = function (alias, articleId, callback) {
    postModel.findOne({ Alias: alias }, (err, article) => {
        if (err) {
            return callback(err);
        }
        if (!article) {
            return callback(null, true);
        }
        if (article._id === articleId) {
            return callback(null, true);
        }
        return callback(null, false);
    });
};

/**
 * 根据id获取文章
 * @param id 文章id
 * @param callback 回调函数
 */
exports.getById = function (id, callback) {
    postModel.findById(id, (err, article) => {
        if (err) {
            return callback(err);
        }
        return callback(null, article);
    });
};

/**
 * 新增或更新文章
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.save = function (params, callback) {
    let _id = params.UniqueId,
        entity = new postModel({
            Title: params.Title,
            Alias: params.Alias,
            Summary: params.Summary,
            Source: params.Source,
            Content: params.Content,
            ContentType: params.ContentType || '',
            CategoryId: params.CategoryId,
            Labels: params.Labels,
            Url: params.Url,
            IsDraft: params.IsDraft === 'True',
            IsActive: params.IsActive === 'True',
            ModifyTime: new Date()
        });
    postModel.findById(_id, (err, article) => {
        if (err) {
            return callback(err);
        }
        if (!article) {
            // 新增
            entity._id = _id;
            entity.IsActive = true;
            entity.ViewCount = 0;
            entity.CreateTime = new Date();
            entity.save(err => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        } else {
            // 更新
            postModel.update({ _id }, entity, err => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        }
    });
};

/**
 * 软删除文章
 * @param ids 文章id，多个id以逗号分隔
 * @param callback 回调函数
 */
exports.delete = function (ids, callback) {
    let idArray = ids.split(','),
        hasErr = false,
        index = 0;
    idArray.forEach(id => {
        postModel.update({ _id: id }, { IsActive: false }, err => {
            index++;
            if (err) {
                hasErr = true;
            }
            if (index === idArray.length) {
                if (hasErr) {
                    return callback(err);
                }
                return callback(null);
            }
        });
    });
};

/**
 * 恢复删除的文章
 * @param id 文章id
 * @param callback 回调函数
 */
exports.undo = function (id, callback) {
    postModel.update({ _id: id }, { IsActive: true }, err => {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};
