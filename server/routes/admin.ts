import { Router } from 'express';
import jwt from 'express-jwt';
import moment from 'moment';
import * as proxy from '../proxy/admin';
import { IResp } from '../../types';
import config from '../../blog.config';

const router = Router();

// JWT middleware
router.use(
  jwt({
    secret: config.jwtSecret
  })
);

router.get('/categories', async (_req, res) => {
  let resp: IResp;
  try {
    const categories = await proxy.getCategories();
    resp = {
      code: 1,
      data: categories
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

router.get('/article', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.getArticle(req.query.uid);
    resp = {
      code: 1,
      data: article
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

router.get('/posts', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getPosts(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 新增文章
router.post('/article', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.newArticle(req.body);
    resp = {
      code: 1,
      data: article
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 修改文章
router.put('/article', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.editArticle(req.query, req.body);
    resp = {
      code: 1,
      data: article
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 删除文章
router.delete('/article', async (req, res) => {
  let resp: IResp;
  try {
    let data;
    if (req.query.force) {
      // 永久删除，不可恢复
      data = await proxy.delete2Article(req.query.uids);
    } else {
      // 临时删除，可恢复
      data = await proxy.deleteArticle(req.query.uids);
    }
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 检查文章alias是否重复
router.get('/checkArticleAlias', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.checkArticleAlias(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 修改发布时间
router.put('/publishTime', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.updatePublishTime(req.query.uid, req.body);
    resp = {
      code: 1,
      data: article
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 检查分类alias是否重复
router.get('/checkCategoryAlias', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.checkCategoryAlias(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 新增分类
router.post('/category', async (req, res) => {
  let resp: IResp;
  try {
    const category = await proxy.newCategory(req.body);
    resp = {
      code: 1,
      data: category
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 修改分类
router.put('/category', async (req, res) => {
  let resp: IResp;
  try {
    const category = await proxy.editCategory(req.query.uid, req.body);
    resp = {
      code: 1,
      data: category
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 删除文章
router.delete('/category', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteCategory(req.query.uids);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/comments', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getComments(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 删除评论
router.delete('/comment', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteComment(req.query.uids);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/guestbook', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getGuestbook(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 删除留言
router.delete('/guestbook', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteGuestbook(req.query.uids);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 修改设置
router.put('/settings', async (req, res) => {
  let resp: IResp;
  try {
    const settings = await proxy.saveSettings(req.body);
    resp = {
      code: 1,
      data: settings
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

// 修改关于
router.put('/profile', async (req, res) => {
  let resp: IResp;
  try {
    const profile = await proxy.saveProfile(req.body);
    resp = {
      code: 1,
      data: profile
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/guestbookStats', async (_req, res) => {
  let resp: IResp;
  try {
    const stats = await proxy.getGuestBookStats();
    resp = {
      code: 1,
      data: stats
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/commentsStats', async (_req, res) => {
  let resp: IResp;
  try {
    const stats = await proxy.getCommentsStats();
    resp = {
      code: 1,
      data: stats
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/postsStats', async (_req, res) => {
  let resp: IResp;
  try {
    const stats = await proxy.getPostsStats();
    resp = {
      code: 1,
      data: stats
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/categoriesStats', async (_req, res) => {
  let resp: IResp;
  try {
    const stats = await proxy.getCategoriesStats();
    resp = {
      code: 1,
      data: stats
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

router.get('/commentsAndGuestbookStats', async (_req, res) => {
  let resp: IResp;
  try {
    const stats = await proxy.getComentsAndGuestbookStats();
    let commentsStats = {};
    let guestbookStats = {};
    (stats.comments || []).forEach(item => {
      commentsStats[item._id] = item.count;
    });
    (stats.guestbook || []).forEach(item => {
      guestbookStats[item._id] = item.count;
    });

    const days = 7;
    const baseCommentsStats = {};
    const baseGuestbookStats = {};
    for (let i = days; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      baseCommentsStats[date] = 0;
      baseGuestbookStats[date] = 0;
    }
    commentsStats = { ...baseCommentsStats, ...commentsStats };
    guestbookStats = { ...baseGuestbookStats, ...guestbookStats };
    resp = {
      code: 1,
      data: {
        commentsStats,
        guestbookStats
      }
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

export default router;
