# iBlog2
基于 Node.js 的个人开源博客系统。  
（基于 ASP.NET 的 iBlog 点击[这里](https://github.com/eshengsky/iBlog/)）

## 功能模块
* **博客**  
展示已发布的文章，支持本地文章和外部链接。  
* **留言**  
供访问者留言。
* **关于**  
一个简约现代的个人简介页面。
* **后台管理**  
包含网站统计、博客管理（新的文章、分类管理、文章管理）、评论管理、留言管理、关于管理、缓存管理、异常管理、系统设置。

## 技术构成
* 服务端 [Node.js](https://nodejs.org/)
* web框架 [Express 4](http://expressjs.com/)
* 模板引擎 [Jade](http://jade-lang.com/)
* JS库 [jQuery](http://jquery.com/)
* UI库 [Bootstrap 3](http://getbootstrap.com/)
* 持久化 [MongoDB](https://www.mongodb.org/)
* 缓存 [Redis](http://redis.io/)
* 日志 [winston](https://github.com/winstonjs/winston/)

## 页面预览
[http://eshengsky.github.io/iBlog2/](http://eshengsky.github.io/iBlog2/)

## 快速开始
#### 准备条件
安装最新版[Node.js](https://nodejs.org/en/download/)、[bower](http://bower.io/)、[MongoDB](https://www.mongodb.org/downloads/)、[Redis](http://redis.io/download/)。  
（注：如果使用Windows平台，可以去[https://github.com/MSOpenTech/redis/releases](https://github.com/MSOpenTech/redis/releases)下载安装Redis）
#### 安装依赖
* 服务端依赖  
```Shell
$ npm install
```
* 客户端依赖  
```Shell
$ bower install
```

#### 参数配置
根据实际情况修改 config.json 配置文件，DbPath 是MongoDB路径，RedisHost 是Redis所在ip，RedisPort 是Redis端口号。  
```JSON
{
  "DbPath": "mongodb://localhost/iBlog2",
  "RedisHost": "127.0.0.1",
  "RedisPort": 6379
}
```
后台管理员账号信息在 config/account.json 中配置，默认管理员账号 admin ，密码 123456 ，密码需md5加密存储。
```JSON
{
  "Id": "1",
  "UserName": "admin",
  "Password": "e10adc3949ba59abbe56e057f20f883e"
}
```
在 "后台管理-系统设置" 页面中，支持以可视化方式配置其余参数。
#### 启动站点  
```Shell
$ node --harmony-proxies ./bin/www 
```
打开浏览器，访问 [http://localhost:3000/](http://localhost:3000)
#### Enjoy it! :smile:
 

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

