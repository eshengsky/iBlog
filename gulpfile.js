const path = require('path');
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const pump = require('pump');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const notifier = require('node-notifier');
const workboxBuild = require('workbox-build');
const minifyJsSrc = path.join(__dirname, './public/src/js/**/*.js');
const minifyCssSrc = path.join(__dirname, './public/src/css/**/*.css');

/**
 * 启动服务器
 */
gulp.task('server', () => {
    nodemon({
        script: path.join(__dirname, './bin/www'),
        ext: 'js pug',
        ignore: [path.join(__dirname, './public/**')],
        stdout: false
    })
        .on('readable', function () {
            this.stdout.pipe(process.stdout);
            this.stderr.pipe(process.stderr);
        });
});

/**
 * 进行Babel编译并压缩js脚本
 */
gulp.task('minify-js', () => {
    pump([
        gulp.src(minifyJsSrc),
        babel({
            presets: ['@babel/env']
        }),
        uglify(),
        gulp.dest(path.join(__dirname, './public/dist/js'))
    ], err => {
        if (err) {
            console.error(`源文件可能包含语法错误，导致压缩出错！\n错误信息：${err.message}\n行号：${err.lineNumber}`);
            notifier.notify('minify-js任务出错，详情请查看终端。');
        } else {
            const msg = 'minify-js任务已完成。';
            console.info(msg);
            notifier.notify(msg);
        }
    });
});

/**
 * 进行css压缩
 */
gulp.task('minify-css', () => {
    pump([
        gulp.src(minifyCssSrc),
        cleanCSS(),
        gulp.dest(path.join(__dirname, './public/dist/css'))
    ], err => {
        if (err) {
            console.error(`minify-css出错！\n错误信息：${err.message}\n行号：${err.lineNumber}`);
            notifier.notify('minify-css任务出错，详情请查看终端。');
        } else {
            const msg = 'minify-css任务已完成。';
            console.info(msg);
            notifier.notify(msg);
        }
    });
});

gulp.task('service-worker', () => {
    return workboxBuild.injectManifest({
        swSrc: path.join(__dirname, './public/src/js/sw.js'),
        swDest: path.join(__dirname, './sw.js'),
        globDirectory: path.join(__dirname, './'),

        // 注意：这里有个坑！后缀{js,css,xxx} 逗号之间不能加空格，否则识别有问题！！！
        globPatterns: [
            'public/**/*.{js,css,html,png,jpg,svg,ico,swf}',
            'node_modules/bootstrap/**/*.min.{js,css}',
            'node_modules/@fortawesome/**/*.{min.css,eot,ttf,woff,woff2}',
            'node_modules/blueimp-file-upload/**/*.{js,css}',
            'node_modules/sweetalert/dist/**/*.{js,css}',
            'node_modules/jquery/dist/**/*.{js,css}',
            'node_modules/metismenu/dist/**/*.{js,css}',
            'node_modules/lodash/**/*.min.js',
            'node_modules/fuelux/dist/**/*.{js,css}',
            'node_modules/simplemde/dist/**/*.{js,css}',
            'node_modules/js-md5/**/*.min.js',
            'node_modules/animate.css/**/*.min.css',
            'node_modules/lightbox2/**/*.min.{js,css}',
            'node_modules/scrollnav/**/*.min.js',
            'node_modules/jquery-qrcode/**/*.min.js',
            'node_modules/malihu-custom-scrollbar-plugin/**/*.{min.js,css,png}',
            'node_modules/jQuery-cycleText/**/*.min.js'
        ],
        globIgnores: ['**/*/test/**/*.js', 'public/libs/**'],
        modifyURLPrefix: {
            'public/favicon.ico': '/favicon.ico',
            'public/': '/static/',
            'node_modules/': '/nodeModules/'
        }
    }).then(({ count, size, warnings }) => {
        warnings.forEach(console.warn);
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
});

/**
 * 监听资源文件改动并自动执行任务
 */
gulp.task('watch', () => {
    gulp.watch(minifyJsSrc, ['minify-js']);
    gulp.watch(minifyCssSrc, ['minify-css']);
});

/**
 * 默认任务
 * 自动启动服务器，并进行一次js和css压缩，并开启文件改动监听
 */
gulp.task('default', ['server', 'minify-js', 'minify-css', 'watch']);
