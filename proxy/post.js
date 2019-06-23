const postModel = require('../models/post')
    .PostModel;
const redisClient = require('../utility/redisClient');
const tool = require('../utility/tool');
const serverlog = require('serverlog-node');
const logger = serverlog.getLogger('post');

/**
 * 为首页数据查询构建条件对象
 * @param params 查询参数对象
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
 */
exports.getPosts = params => {
    const cache_key = tool.generateKey('posts', params);
    return new Promise((resolve, reject) => {
        redisClient.getItem(cache_key).then(posts => {
            if (posts) {
                return resolve(posts);
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
                    return reject(err);
                }
                if (posts) {
                    redisClient.setItem(cache_key, posts, redisClient.defaultExpired);
                }

                logger.infoE('构建的查询对象：', query, '数据库返回结果：', posts)
                return resolve(posts);
            });
        }, err => {
            reject(err);
        });
    });
};

/**
 * 获取首页文章的页数
 * @param params 参数对象
 */
exports.getPageCount = params => {
    const cache_key = tool.generateKey('posts_count', params);
    return new Promise((resolve, reject) => {
        redisClient.getItem(cache_key).then(pageCount => {
            if (pageCount) {
                return resolve(pageCount);
            }
            const query = getPostsQuery(params);
            postModel.count(query, (err, count) => {
                if (err) {
                    return reject(err);
                }
                const pageCount = count % params.pageSize === 0 ? parseInt(count / params.pageSize) : parseInt(count / params.pageSize) + 1;
                redisClient.setItem(cache_key, pageCount, redisClient.defaultExpired);
                return resolve(pageCount);
            });
        }, err => {
            reject(err);
        });
    });
};

/**
 * 根据alias获取文章
 * @param alias 文章alias
 */
exports.getPostByAlias = alias => {
    const cache_key = `article_${alias}`;

    // 文章浏览数+1
    postModel.update({ Alias: alias }, { $inc: { ViewCount: 1 } })
        .exec();

    return new Promise((resolve, reject) => {
        redisClient.getItem(cache_key).then(article => {
            if (article) {
                return resolve(article);
            }
            postModel.findOne({ Alias: alias }, (err, article) => {
                if (err) {
                    return reject(err);
                }
                if (article) {
                    redisClient.setItem(cache_key, article, redisClient.defaultExpired);
                }
                return resolve(article);
            });
        }, err => {
            reject(err);
        });
    });
};

/**
 * 为后台数据查询构建条件对象
 * @param params
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
 */
exports.getArticles = params => {
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
    return new Promise((resolve, reject) => {
        postModel.find(query, {}, options, (err, posts) => {
            if (err) {
                return reject(err);
            }
            return resolve(posts);
        });
    });
};

/**
 * 获取管理页面的文章数
 * @param params 参数对象
 */
exports.getArticlesCount = params => {
    const query = getArticlesQuery(params);
    return new Promise((resolve, reject) => {
        postModel.count(query, (err, count) => {
            if (err) {
                return reject(err);
            }
            return resolve(count);
        });
    });
};

/**
 * 判断文章Alias是否唯一
 * @param alias 文章Alias
 * @param articleId 文章Id
 */
exports.checkAlias = (alias, articleId) => {
    return new Promise((resolve, reject) => {
        postModel.findOne({ Alias: alias }, (err, article) => {
            if (err) {
                return reject(err);
            }
            if (!article) {
                return resolve(true);
            }
            if (article._id === articleId) {
                return resolve(true);
            }
            return resolve(false);
        });
    });
};

/**
 * 根据id获取文章
 * @param id 文章id
 */
exports.getById = id => {
    return new Promise((resolve, reject) => {
        postModel.findById(id, (err, article) => {
            if (err) {
                return reject(err);
            }
            return resolve(article);
        });
    });
};

/**
 * 新增或更新文章
 * @param params 参数对象
 */
exports.save = params => {
    const _id = params.UniqueId;
    const entity = new postModel({
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
    return new Promise((resolve, reject) => {
        postModel.findById(_id, (err, article) => {
            if (err) {
                return reject(err);
            }
            if (!article) {
                // 新增
                entity._id = _id;
                entity.IsActive = true;
                entity.ViewCount = 0;
                entity.CreateTime = new Date();
                entity.save(err => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            } else {
                // 更新
                postModel.update({ _id }, entity, err => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            }
        });
    });
};

/**
 * 软删除文章
 * @param ids 文章id，多个id以逗号分隔
 */
exports.delete = ids => {
    const idArray = ids.split(',');
    const promiseArr = idArray.map(id => {
        return postModel.update({ _id: id }, { IsActive: false }).exec()
    });
    return new Promise((resolve, reject) => {
        Promise.all(promiseArr).then(() => {
            resolve();
        }, err => {
            reject(err);
        });
    });
};

/**
 * 恢复删除的文章
 * @param id 文章id
 */
exports.undo = id => {
    return new Promise((resolve, reject) => {
        postModel.update({ _id: id }, { IsActive: true }, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};
