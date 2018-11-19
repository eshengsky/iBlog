const path = require('path');
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const pump = require('pump');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const notifier = require('node-notifier');
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
