import DB from '../db';
import BadWords from '../bad_words/index';
import { IPost, ICache, IComment } from '~/types/schema';
const { Post, Cache, Category, Comment, Guestbook, Setting, Profile } = DB.Models;
const badWords = BadWords.instance;

export async function getCategories () {
  const categories = await Category.find(
    {},
    {},
    { sort: 'sequence cateName' }
  ).exec();
  return categories;
}

export async function getPosts (params) {
  let page = 1;
  const pageSize = parseInt(params.pageSize);
  page = parseInt(params.pageIndex) || 1;
  page = page > 0 ? page : 1;
  const conditions: any = {
    isDraft: false,
    isActive: true
  };
  if (params.category) {
    conditions.category = params.category;
  }
  const keyword = params.keyword;
  if (keyword) {
    switch (params.filterType) {
      case 'title':
        conditions.title = { $regex: keyword, $options: 'gi' };
        break;
      case 'tag':
        conditions.labels = { $regex: keyword, $options: 'gi' };
        break;
      case 'date':
        if (
          Array.isArray(keyword) &&
                    keyword.length === 2 &&
                    keyword[0] &&
                    keyword[1]
        ) {
          const start = new Date(keyword[0]);
          const end = new Date(keyword[1]);
          conditions.publishTime = { $gte: start, $lt: end };
        }
        break;
      default:
        conditions.$or = [
          {
            title: {
              $regex: keyword,
              $options: 'gi'
            }
          },
          {
            labels: {
              $regex: keyword,
              $options: 'gi'
            }
          },
          {
            content: {
              $regex: keyword,
              $options: 'gi'
            }
          }
        ];
    }
  }
  const data = await Promise.all([
    Post.find(
      conditions,
      {},
      {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        sort: '-publishTime'
      }
    )
      .populate('category')
      .populate('comments', '_id')
      .exec(),
    Post.countDocuments(conditions).exec()
  ]);
  const postList = data[0];
  const count = data[1];
  const pageCount = Math.ceil(count / pageSize);

  return {
    postList,
    count,
    hasNext: pageCount > page
  };
}

export async function getPopArticles () {
  const conditions: any = {
    isDraft: false,
    isActive: true
  };
  const articles = await Post.find(conditions, '-content', {
    sort: '-viewCount',
    limit: 7
  })
    .populate('category')
    .exec();
  return {
    articles
  };
}
export async function getPopLabels () {
  const labels = await Post.aggregate([
    {
      $unwind: '$labels'
    },
    {
      $group: {
        _id: '$labels',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1, _id: 1 }
    },
    {
      $limit: 10
    }
  ]).exec();
  return {
    labels
  };
}

export async function getArticle (params, user) {
  const alias = params.alias;
  const conditions = {
    alias
  } as IPost;
  if (!user) {
    // 未登录，即不是管理员账号，则限制只展示已发布和未删除的文章
    conditions.isDraft = false;
    conditions.isActive = true;
  }
  const article = await Post.findOne(conditions)
    .populate('category')
    .exec();
  return article;
}

export async function getPostsCountByCate (category) {
  const count = await Post.countDocuments({
    category,
    isDraft: false,
    isActive: true
  } as IPost).exec();
  return count;
}

export async function increaseViews ({ postID, clientIP }) {
  // 判断该IP用户是否已看过该文章
  const exists = await Cache.exists({
    clientIP,
    ext1: postID,
    ext2: 'viewCount'
  } as ICache);

  // 如果没看过
  if (!exists) {
    // 文章浏览数+1
    Post.findByIdAndUpdate(postID, {
      $inc: { viewCount: 1 }
    }).exec();

    // 同时，将用户IP和文章ID存入缓存
    Cache.create({
      clientIP,
      ext1: postID,
      ext2: 'viewCount'
    });
  }
}

export async function getComments (params) {
  let page = 1;
  const pageSize = parseInt(params.pageSize);
  page = parseInt(params.pageIndex) || 1;
  page = page > 0 ? page : 1;
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = '-createTime';
  const query = {
    post: params.articleId
  } as IComment;
  const data = await Promise.all([
    Comment.find(query, {}, options).exec(),
    Comment.countDocuments(query).exec()
  ]);
  const comments = data[0];
  const count = data[1];
  const pageCount = Math.ceil(count / pageSize);
  return {
    comments,
    count,
    hasNext: pageCount > page
  };
}

export async function saveComment (params) {
  const entity = new Comment({
    post: params.articleId,
    username: badWords.filter(params.username),
    website: params.website,
    content: badWords.filter(params.content),
    createTime: new Date()
  } as IComment);
  const comment = await entity.save();
  return {
    comment
  };
}

export async function getGuestbook (params) {
  let page = 1;
  const pageSize = parseInt(params.pageSize);
  page = parseInt(params.pageIndex) || 1;
  page = page > 0 ? page : 1;
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = '-createTime';
  const data = await Promise.all([
    Guestbook.find({}, {}, options).exec(),
    Guestbook.countDocuments({}).exec()
  ]);
  const comments = data[0];
  const count = data[1];
  const pageCount = Math.ceil(count / pageSize);
  return {
    comments,
    count,
    hasNext: pageCount > page
  };
}

export async function saveGuestbook (params) {
  const entity = new Guestbook({
    username: badWords.filter(params.username),
    website: params.website,
    content: badWords.filter(params.content),
    createTime: new Date()
  } as IComment);
  const comment = await entity.save();
  return {
    comment
  };
}

export async function getSettings () {
  const settings = await Setting.findOne().exec();
  return {
    settings
  };
}

export async function getProfile () {
  const profile = await Profile.findOne().exec();
  return {
    profile
  };
}
