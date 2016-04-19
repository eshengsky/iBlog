var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var tool = require('../utility/tool');
var multer = require('multer');
var shortid = require('shortid');

//图片上传配置
var storageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.query.uniqueId) {
            var dirPathParent = path.join(__dirname, '../public/uploads/', req.query.uniqueId),
                dirPath = path.join(dirPathParent, 'img');//不能直接创建dirPath，因为父目录不存在会抛出异常
            fs.mkdir(dirPathParent, function (err) {
                if (err && err.code !== 'EEXIST') {
                    cb(err);
                } else {
                    fs.mkdir(dirPath, function (err) {
                        if (err && err.code !== 'EEXIST') {
                            cb(err);
                        } else {
                            cb(null, dirPath);
                        }
                    });
                }
            });
        } else {
            cb(new Error('参数uniqueId不存在！'));
        }
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + '_' + shortid.generate();
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        var fullName = fileName + ext;
        cb(null, fullName)
    }
});

//附件上传配置
var storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.query.uniqueId) {
            var dirPathParent = path.join(__dirname, '../public/uploads/', req.query.uniqueId),
                dirPath = path.join(dirPathParent, 'file');
            fs.mkdir(dirPathParent, function (err) {
                if (err && err.code !== 'EEXIST') {
                    cb(err);
                } else {
                    fs.mkdir(dirPath, function (err) {
                        if (err && err.code !== 'EEXIST') {
                            cb(err);
                        } else {
                            cb(null, dirPath);
                        }
                    });
                }
            });
        } else {
            cb(new Error('参数uniqueId不存在！'));
        }
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + '_' + shortid.generate();
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        var fullName = fileName + ext;
        cb(null, fullName)
    }
});

router.get('/', function (req, res, next) {
    var list = [],
        total = 0,
        rootPath = path.join(__dirname, '../public/uploads/'),
        rootFiles,
        parFiles,
        files,
        stat;
    switch (req.query.action) {
        //获取配置
        case 'config':
            tool.getConfig(path.join(__dirname, '../config/ue.json'), function (err, settings) {
                if (err) {
                    next(err);
                } else {
                    res.json(settings);
                }
            });
            break;
        //图片管理
        case 'listimage':
            rootFiles = fs.readdirSync(rootPath);
            rootFiles.forEach(function (rootFile) {
                stat = fs.statSync(path.join(rootPath, rootFile));
                if (stat.isDirectory()) {
                    parFiles = fs.readdirSync(path.join(rootPath, rootFile));
                    parFiles.forEach(function (parFile) {
                        if (parFile === 'img') {
                            files = fs.readdirSync(path.join(rootPath, rootFile, 'img'));
                            total += files.length;
                            files.forEach(function (imgFile) {
                                list.push({
                                    url: '/uploads/' + rootFile + '/img/' + imgFile
                                });
                            });
                        }
                    });
                }
            });
            res.json({
                state: total === 0 ? 'no match file' : 'SUCCESS',
                list: list,
                total: total,
                start: parseInt(req.query.start),
                size: parseInt(req.query.size)
            });
            break;
        //附件管理
        case 'listfile':
            rootFiles = fs.readdirSync(rootPath);
            rootFiles.forEach(function (rootFile) {
                stat = fs.statSync(path.join(rootPath, rootFile));
                if (stat.isDirectory()) {
                    parFiles = fs.readdirSync(path.join(rootPath, rootFile));
                    parFiles.forEach(function (parFile) {
                        if (parFile === 'file') {
                            files = fs.readdirSync(path.join(rootPath, rootFile, parFile));
                            total += files.length;
                            files.forEach(function (attachFile) {
                                list.push({
                                    url: '/uploads/' + rootFile + '/file/' + attachFile
                                });
                            });
                        }
                    });
                }
            });
            res.json({
                state: total === 0 ? 'no match file' : 'SUCCESS',
                list: list,
                total: total,
                start: parseInt(req.query.start),
                size: parseInt(req.query.size)
            });
            break;
    }
});

router.post('/', function (req, res, next) {
    var uploadFile;
    switch (req.query.action) {
        //上传图片
        case 'uploadimage':
            uploadFile = multer({storage: storageImg}).single('upfile');
            uploadFile(req, res, function (err) {
                if (err) {
                    next(err);
                } else {
                    res.json({
                        state: "SUCCESS",
                        url: '/uploads/' + req.query.uniqueId + '/img/' + req.file.filename,//此处不能用path.join，因为path会使用'\'分隔符，而url地址必须是'/'分隔符
                        title: req.file.originalname,
                        original: req.file.originalname,
                        error: null
                    });
                }
            });
            break;
        //上传涂鸦
        case 'uploadscrawl':
            var dataBuffer = new Buffer(req.body.upfile, 'base64'),
                fileName = shortid.generate() + '.png';
            if (req.query.uniqueId) {
                var dirPathParent = path.join(__dirname, '../public/uploads/', req.query.uniqueId),
                    dirPath = path.join(dirPathParent, 'img');//不能直接创建dirPath，因为父目录不存在会抛出异常
                fs.mkdir(dirPathParent, function (err) {
                    if (err && err.code !== 'EEXIST') {
                        next(err);
                    } else {
                        fs.mkdir(dirPath, function (err) {
                            if (err && err.code !== 'EEXIST') {
                                next(err);
                            } else {
                                fs.writeFile(path.join(dirPath, fileName), dataBuffer, function (err) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        res.json({
                                            state: "SUCCESS",
                                            url: '/uploads/' + req.query.uniqueId + '/img/' + fileName,//此处不能用path.join，因为path会使用'\'分隔符，而url地址必须是'/'分隔符
                                            title: fileName,
                                            original: fileName,
                                            error: null
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                next(new Error('参数uniqueId不存在！'));
            }
            break;
        //上传附件
        case 'uploadfile':
            uploadFile = multer({storage: storageFile}).single('upfile');
            uploadFile(req, res, function (err) {
                if (err) {
                    next(err);
                } else {
                    res.json({
                        state: "SUCCESS",
                        url: '/uploads/' + req.query.uniqueId + '/file/' + req.file.filename,//此处不能用path.join，因为path会使用'\'分隔符，而url地址必须是'/'分隔符
                        title: req.file.originalname,
                        original: req.file.originalname,
                        error: null
                    });
                }
            });
            break;
    }
});

module.exports = router;