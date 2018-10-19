# iBlog2
基于 Node.js 的开源个人开源博客系统，采用响应式布局，支持手机访问，功能全面，美观大方。  
**不仅仅是博客，更是 Demo**，是适合新人入门学习的完整项目。  
(基于 ASP.NET 的版本见 [这里](https://github.com/eshengsky/iBlog/))

## 在线实例
我的博客 [http://139.196.22.226/](http://139.196.22.226/)

## [noginx](https://github.com/eshengsky/noginx)
[noginx](https://github.com/eshengsky/noginx) 是基于 Node.js 的 HTTP 及反向代理服务器（类似 nginx），如果你有多台 iBlog2 服务器实例，你可以使用 [noginx](https://github.com/eshengsky/noginx) 进行代理转发和负载均衡。

## [Wiki](https://github.com/eshengsky/iBlog2/wiki)
整理了 iBlog2 中涉及 Node.js 及部分前端技术的知识点，适合新手学习、备查。

## 功能模块
* 文章列表
  * 支持搜索
  * 创新的竖向分页
* 文章详情
  * 自动生成目录
  * 支持评论 (基于[畅言](http://changyan.kuaizhan.com/))
* 留言
* 关于
* 后台管理
  * 网站统计  
  * 博客管理 - 新的文章 (支持 UEditor 和 Markdown 编辑器)  
  * 博客管理 - 分类管理  
  * 博客管理 - 文章管理  
  * 评论管理  
  * 留言管理  
  * 关于管理  
  * 缓存管理  
  * 异常管理  
  * 系统设置  

## 技术构成
* 服务端 [Node.js](https://nodejs.org/)
* web框架 [Express 4](http://expressjs.com/)
* 模板引擎 [Pug](https://pugjs.org/)
* JS库 [jQuery](http://jquery.com/)
* UI库 [Bootstrap 3](http://getbootstrap.com/)
* Web字体 [Font Awesome](https://fontawesome.com/)
* 持久化 [MongoDB](https://www.mongodb.org/)
* 缓存(可选) [Redis](http://redis.io/)
* 日志 [winston](https://github.com/winstonjs/winston/)
* 多语言 [i18n](https://github.com/mashpie/i18n-node)
* 身份验证 [Passport](http://www.passportjs.org/)

## 快速开始
#### 准备条件
安装 [Node.js](https://nodejs.org/en/download/) (v6 以上版本)、[MongoDB](https://www.mongodb.org/downloads/)、[Redis](http://redis.io/download/)（可选）。  
（注：如果使用Windows平台，可以去[https://github.com/MSOpenTech/redis/releases](https://github.com/MSOpenTech/redis/releases)下载安装Redis）
#### 安装依赖
```Shell
$ npm install
```

#### 启动站点  

```Shell
$ node bin/www 
```

打开浏览器，访问 [http://localhost:3000/](http://localhost:3000)
#### Enjoy it! :smile:

## 配置说明

### 系统配置
根据实际情况修改 `/config.json` 配置文件，修改后需要重启服务器。参数说明：

##### ssl
Object 类型，SSL 安全设置。

##### ssl.enable
Boolean 类型，是否创建 HTTPS 站点。

##### ssl.key
String 类型，私钥文件路径。

##### ssl.cert
String 类型，证书文件路径。

##### mongoUrl
String 类型，MongoDB 连接字符串。

##### redis
Object 类型，Redis 缓存设置。

##### redis.enable
Boolean 类型，是否启用缓存功能。

##### redis.host
String 类型，Redis 服务器host。

##### redis.port
Number 类型，Redis 服务器端口号。

### 用户配置

后台管理员账号信息在 `/config/account.json` 中配置，修改后需要重启服务器。参数说明：

##### Id
String 类型，管理员账号唯一标识。

##### UserName
String 类型，管理员账号的用户名。

##### Password
String 类型，管理员账号的密码，必须是32位 md5 加密后的字符串。

初始管理员账号：admin/123456

### 站点配置

以管理员身份登录后台 [http://localhost:3000/admin](http://localhost:3000/admin) ，在系统设置页面，支持以可视化方式配置相关参数，修改参数后不需要重启。

## 关于缓存

如果开启了缓存功能，在缓存有效期内，文章分类、文章列表、文章详细等数据都将从缓存中获取，若想使修改立即可见，你需要在 "后台管理 - 缓存管理" 页面手动清除相关缓存。

## 线上部署

#### 使用守护进程
iBlog2 自带的守护进程能够利用多核 CPU 性能，并在出现异常退出后自动重启服务。

```Shell
$ NODE_ENV=production node daemon.js
```

#### 使用PM2
推荐使用 [pm2](https://github.com/Unitech/pm2) 进行 Node.js 的进程管理和持久运行，其基本原理与上述守护进程一致。

##### 安装
```Shell
$ npm install -g pm2
```
##### 启动
```Shell
$ NODE_ENV=production pm2 start bin/www -i 0
```

#### 使用noginx
[noginx](https://github.com/eshengsky/noginx) 是基于 Node.js 的 HTTP 及反向代理服务器（类似 nginx），如果你有多台 iBlog2 服务器实例，你可以使用 [noginx](https://github.com/eshengsky/noginx) 进行代理转发和负载均衡。

## 贡献者们
感谢给 iBlog2 项目贡献代码的朋友，感谢他们的支持，详情 [点击这里](https://github.com/eshengsky/iBlog2/graphs/contributors)。

## 许可协议
The MIT License (MIT)

Copyright (c) 2016 Sky

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
