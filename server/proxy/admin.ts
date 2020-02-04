import moment from 'moment';
import mongoose from 'mongoose';
import DB from '../db';
import { otherCategoryItem } from '../models/category';
import { IPost, IProfile } from '../../types/schema';
const { Category, Post, Comment, Guestbook, Setting, Profile } = DB.Models;

export async function getCategories () {
  const categories = await Category.find(
    {},
    {},
    { sort: 'sequence cateName' }
  ).exec();
  return categories;
}

export async function getPosts (params: any) {
  const matchObj: any = {};
  const {
    category,
    alias,
    title,
    content,
    label,
    createTime,
    modifyTime,
    publishTime,
    isLink,
    isDraft,
    hasComments,
    isDeleted
  } = params;
  if (category) {
    matchObj.category = mongoose.Types.ObjectId(category);
  }
  if (alias) {
    matchObj.alias = alias;
  }
  if (title) {
    matchObj.title = { $regex: title, $options: 'gi' };
  }
  if (content) {
    matchObj.content = { $regex: content, $options: 'gi' };
  }
  if (label) {
    matchObj.labels = { $regex: label, $options: 'gi' };
  }
  if (
    Array.isArray(createTime) &&
        createTime.length === 2 &&
        createTime[0] &&
        createTime[1]
  ) {
    const start = new Date(createTime[0]);
    const end = new Date(createTime[1]);
    matchObj.createTime = { $gte: start, $lt: end };
  }
  if (
    Array.isArray(modifyTime) &&
        modifyTime.length === 2 &&
        modifyTime[0] &&
        modifyTime[1]
  ) {
    const start = new Date(modifyTime[0]);
    const end = new Date(modifyTime[1]);
    matchObj.modifyTime = { $gte: start, $lt: end };
  }
  if (
    Array.isArray(publishTime) &&
        publishTime.length === 2 &&
        publishTime[0] &&
        publishTime[1]
  ) {
    const start = new Date(publishTime[0]);
    const end = new Date(publishTime[1]);
    matchObj.publishTime = { $gte: start, $lt: end };
  }
  if (isLink === '1' || isLink === '-1') {
    matchObj.isLocal = isLink === '-1';
  }
  if (isDraft === '1' || isDraft === '-1') {
    matchObj.isDraft = isDraft === '1';
  }
  if (isDeleted === '1' || isDeleted === '-1') {
    matchObj.isActive = isDeleted === '-1';
  }
  if (hasComments === '1' || hasComments === '-1') {
    matchObj.comments = {
      [hasComments === '1' ? '$gt' : '$eq']: []
    };
  }

  // 排序
  let sortObj: any = {
    createTime: -1
  };

  // 先按sortBy字段进行排序
  if (params.sortBy) {
    sortObj = {
      [params.sortBy]: params.order === 'descend' ? -1 : 1
    };
  }

  // 再按创建时间排序
  if (params.sortBy !== 'createTime') {
    sortObj.createTime = -1;
  }

  const page = parseInt(params.pageIndex);
  const pageSize = parseInt(params.pageSize);
  const aggregate = [
    {
      // 关联分类集合
      $lookup: {
        from: 'category',
        localField: 'category',
        foreignField: '_id',
        as: 'categories'
      }
    },
    {
      // 关联评论集合
      $lookup: {
        from: 'comment',
        localField: '_id',
        foreignField: 'post',
        as: 'comments'
      }
    },
    {
      // 额外添加一个评论数字段
      $addFields: {
        commentsCount: { $size: '$comments' }
      }
    },
    {
      // 关联之后，再去筛选
      $match: matchObj
    },
    {
      // 筛选之后，再去排序
      $sort: sortObj
    },
    {
      $project: {
        content: 0,
        'categories.img': 0
      }
    }
  ];

  const data = await Promise.all([
    Post.aggregate(aggregate)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec(),
    Post.aggregate(aggregate)
      .count('totalCount')
      .exec()
  ]);
  return {
    postList: data[0],
    count: data[1].length === 0 ? 0 : data[1][0].totalCount
  };
}

export async function getArticle (uid) {
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return null;
  }
  const article = await Post.findById(uid).exec();
  return article;
}

export async function newArticle (params) {
  const now = new Date();
  const doc: IPost = {
    createTime: now,
    modifyTime: now,
    ...params
  };
  if (!params.isDraft) {
    doc.publishTime = now;
  }
  const entity = new Post(doc);
  const newArticle = await entity.save();
  return {
    article: newArticle
  };
};

export async function editArticle (query, params: IPost) {
  const now = new Date();
  params.modifyTime = now;

  // 草稿状态->已发布，要修改publishTime字段
  if (query.pubtype === 'publish') {
    params.publishTime = now;
  }

  // 已发布->草稿状态，要移除publishTime字段
  if (query.pubtype === 'unpublish') {
    params.publishTime = undefined;
  }
  const article = await Post.findByIdAndUpdate(query.uid, params, {
    new: true
  }).exec();
  return {
    article
  };
};

export async function deleteArticle (uids: Array<string> | string) {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Post.updateMany(
    { _id: { $in: uids } },
    { isActive: false, publishTime: null }
  ).exec();
  return {
    result
  };
};

// 永久删除文章，对应的评论也要删除
export async function delete2Article (uid) {
  const result = await Promise.all([
    Post.findByIdAndDelete(uid).exec(),
    Comment.deleteMany({ post: uid }).exec()
  ]);
  return {
    result
  };
};

export async function checkArticleAlias ({ alias, excludeUid }) {
  const filter: any = {};
  filter.alias = alias;
  if (excludeUid) {
    filter._id = { $ne: excludeUid };
  }
  const exists = await Post.exists(filter);
  return {
    exists
  };
};

export async function updatePublishTime (uid, params) {
  const article = await Post.findByIdAndUpdate(uid, {
    publishTime: new Date(params.publishTime)
  }, {
    new: true
  }).exec();
  return {
    article
  };
};

export async function checkCategoryAlias ({ alias, excludeUid }) {
  const filter: any = {};
  filter.alias = alias;
  if (excludeUid) {
    filter._id = { $ne: excludeUid };
  }
  const exists = await Category.exists(filter);
  return {
    exists
  };
};

export async function newCategory (params) {
  const now = new Date();
  const entity = new Category({
    createTime: now,
    modifyTime: now,
    ...params
  });
  const newCategory = await entity.save();
  return {
    category: newCategory
  };
};

export async function editCategory (uid, params) {
  params.modifyTime = new Date();
  const category = await Category.findByIdAndUpdate(uid, params, {
    new: true
  }).exec();
  return {
    category
  };
};

export async function deleteCategory (uids: Array<string> | string) {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Promise.all([
    Category.deleteMany({ _id: { $in: uids } }).exec(),
    Post.updateMany(
      { category: { $in: uids } },
      { category: otherCategoryItem._id.toHexString() }
    ).exec()
  ]);
  return {
    result
  };
};

export async function getComments (params) {
  const matchObj: any = {};
  const { username, content, createTime, alias } = params;
  if (username) {
    matchObj.username = { $regex: username, $options: 'gi' };
  }
  if (content) {
    matchObj.content = { $regex: content, $options: 'gi' };
  }
  if (
    Array.isArray(createTime) &&
    createTime.length === 2 &&
    createTime[0] &&
    createTime[1]
  ) {
    const start = new Date(createTime[0]);
    const end = new Date(createTime[1]);
    matchObj.createTime = { $gte: start, $lt: end };
  }
  if (alias) {
    matchObj['posts.alias'] = alias;
  }

  // 排序
  let sortObj: any = {
    createTime: -1
  };
  if (params.sortBy) {
    sortObj = {
      [params.sortBy]: params.order === 'descend' ? -1 : 1
    };
  }

  const page = parseInt(params.pageIndex);
  const pageSize = parseInt(params.pageSize);
  const aggregate = [
    {
      // 关联文章集合
      $lookup: {
        from: 'post',
        localField: 'post',
        foreignField: '_id',
        as: 'posts'
      }
    },
    {
      // 关联分类集合
      $lookup: {
        from: 'category',
        localField: 'posts.category',
        foreignField: '_id',
        as: 'categories'
      }
    },
    {
      // 关联之后，再去筛选
      $match: matchObj
    },
    {
      // 筛选之后，再去排序
      $sort: sortObj
    },
    {
      $project: {
        'posts.content': 0,
        'categories.img': 0
      }
    }
  ];

  const data = await Promise.all([
    Comment.aggregate(aggregate)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec(),
    Comment.aggregate(aggregate)
      .count('totalCount')
      .exec()
  ]);

  return {
    comments: data[0],
    count: data[1].length === 0 ? 0 : data[1][0].totalCount
  };
};

export async function deleteComment (uids: Array<string> | string) {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Comment.deleteMany({ _id: { $in: uids } }).exec();
  return {
    result
  };
};

export async function getGuestbook (params) {
  const page = parseInt(params.pageIndex || '1');
  const pageSize = parseInt(params.pageSize || '10');
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = `${params.order === 'descend' ? '-' : ''}${params.sortBy}`;
  const query: any = {};
  if (params.username) {
    query.username = { $regex: params.username, $options: 'gi' };
  }
  if (params.content) {
    query.content = { $regex: params.content, $options: 'gi' };
  }
  if (
    Array.isArray(params.createTime) &&
    params.createTime.length === 2 &&
    params.createTime[0] &&
    params.createTime[1]
  ) {
    const start = new Date(params.createTime[0]);
    const end = new Date(params.createTime[1]);
    query.createTime = { $gte: start, $lt: end };
  }
  const data = await Promise.all([
    Guestbook.find(query, {}, options).exec(),
    Guestbook.countDocuments(query).exec()
  ]);
  return {
    comments: data[0],
    count: data[1]
  };
};

export async function deleteGuestbook (uids: Array<string> | string) {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Guestbook.deleteMany({ _id: { $in: uids } }).exec();
  return {
    result
  };
};

export async function saveSettings (params) {
  const settings = await Setting.findOneAndUpdate({}, params, {
    new: true
  }).exec();
  return {
    settings
  };
};

export async function saveProfile (params) {
  const exists = await Profile.exists({});
  const now = new Date();
  if (!exists) {
    const doc: IProfile = {
      createTime: now,
      modifyTime: now,
      ...params
    };
    const entity = new Profile(doc);
    const newProfile = await entity.save();
    return {
      profile: newProfile
    };
  } else {
    params.modifyTime = now;
    const profile = await Profile.findOneAndUpdate({}, params, {
      new: true
    }).exec();
    return {
      profile
    };
  }
};

function subtractDate (days) {
  return moment()
    .subtract(days, 'days')
    .startOf('day')
    .toDate();
};

export async function getGuestBookStats () {
  const stats = await Promise.all([
    // 今天
    Guestbook.countDocuments({
      createTime: {
        $gte: moment()
          .startOf('day')
          .toDate(),
        $lt: moment().toDate()
      }
    }).exec(),

    // 昨天
    Guestbook.countDocuments({
      createTime: {
        $gte: subtractDate(1),
        $lt: moment()
          .subtract(1, 'days')
          .endOf('day')
          .toDate()
      }
    }).exec(),

    // 最近7天
    Guestbook.countDocuments({
      createTime: {
        $gte: subtractDate(7),
        $lt: moment().toDate()
      }
    }).exec(),

    // 最近30天
    Guestbook.countDocuments({
      createTime: {
        $gte: subtractDate(30),
        $lt: moment().toDate()
      }
    }).exec(),

    // 全部
    Guestbook.estimatedDocumentCount().exec()
  ]);
  return {
    today: stats[0],
    yesterday: stats[1],
    oneweek: stats[2],
    onemonth: stats[3],
    total: stats[4]
  };
};

export async function getCommentsStats () {
  const stats = await Promise.all([
    // 今天
    Comment.countDocuments({
      createTime: {
        $gte: moment()
          .startOf('day')
          .toDate(),
        $lt: moment().toDate()
      }
    }).exec(),

    // 昨天
    Comment.countDocuments({
      createTime: {
        $gte: subtractDate(1),
        $lt: moment()
          .subtract(1, 'days')
          .endOf('day')
          .toDate()
      }
    }).exec(),

    // 最近7天
    Comment.countDocuments({
      createTime: {
        $gte: subtractDate(7),
        $lt: moment().toDate()
      }
    }).exec(),

    // 最近30天
    Comment.countDocuments({
      createTime: {
        $gte: subtractDate(30),
        $lt: moment().toDate()
      }
    }).exec(),

    // 全部
    Comment.estimatedDocumentCount().exec()
  ]);
  return {
    today: stats[0],
    yesterday: stats[1],
    oneweek: stats[2],
    onemonth: stats[3],
    total: stats[4]
  };
};

export async function getPostsStats () {
  const stats = await Promise.all([
    // 草稿
    Post.countDocuments({
      isDraft: true,
      isActive: true
    }).exec(),

    // 7天内发布
    Post.countDocuments({
      isDraft: false,
      isActive: true,
      publishTime: {
        $gte: subtractDate(7),
        $lt: moment().toDate()
      }
    }).exec(),

    // 30天内发布
    Post.countDocuments({
      isDraft: false,
      isActive: true,
      publishTime: {
        $gte: subtractDate(30),
        $lt: moment().toDate()
      }
    }).exec(),

    // 总计发布
    Post.countDocuments({
      isDraft: false,
      isActive: true
    }).exec(),

    // 全部分类
    Category.estimatedDocumentCount().exec()
  ]);
  return {
    draft: stats[0],
    oneweek: stats[1],
    onemonth: stats[2],
    totalPosts: stats[3],
    totalCategories: stats[4]
  };
};

export async function getCategoriesStats () {
  const stats = await Category.aggregate([
    {
      $lookup: {
        from: 'post',
        localField: '_id',
        foreignField: 'category',
        as: 'posts'
      }
    },
    {
      $project: {
        cateName: 1,
        postsCount: {
          $size: '$posts'
        }
      }
    },
    {
      $sort: { postsCount: -1, cateName: 1 }
    }
  ]);
  return stats;
};

export async function getComentsAndGuestbookStats () {
  const days = 7;
  const stats: [any[] | undefined, any[] | undefined] = await Promise.all([
    Comment.aggregate([
      {
        $match: {
          createTime: {
            $gte: subtractDate(days),
            $lt: moment().toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createTime',
              timezone: '+08'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).exec(),
    Guestbook.aggregate([
      {
        $match: {
          createTime: {
            $gte: subtractDate(days),
            $lt: moment().toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createTime',
              timezone: '+08'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).exec()
  ]);
  return {
    comments: stats[0],
    guestbook: stats[1]
  };
};
