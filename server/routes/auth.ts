import { Router } from 'express';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import * as proxy from '../proxy/auth';
import { IResp } from '../../types';
import config from '../../blog.config';

const router = Router();

// 判断账户是否存在（是否已初始化）
router.get('/exists', async (_req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.existsAccount();
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

// 初始化账户
router.put('/account', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.newAccount(req.body);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

// 修改密码
router.post(
  '/account',
  jwt({ secret: config.jwtSecret }),
  async (req, res) => {
    let resp: IResp;
    try {
      const code = await proxy.changePassword(req.body);
      if (code === -2) {
        resp = {
          code: -1,
          message: '原密码不正确！'
        };
      } else {
        resp = {
          code: 1
        };
      }
    } catch (err) {
      console.error(err);
      resp = {
        code: -1,
        message: '操作失败！'
      };
    }
    res.json(resp);
  }
);

// 获取当前用户
router.get('/user', jwt({ secret: config.jwtSecret }), (req, res) => {
  res.json({ user: (req as any).user });
});

// 提交登录请求
router.post('/login', async (req, res) => {
  try {
    const data = await proxy.findAccount(req.body);
    if (!data.account) {
      return res.sendStatus(401);
    }

    const accessToken = jsonwebtoken.sign(
      {
        username: 'Admin'
      },
      config.jwtSecret
    );

    res.json({
      token: {
        accessToken
      }
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// 退出登录
router.post('/logout', jwt({ secret: config.jwtSecret }), (_req, res) => {
  res.end();
});

export default router;
