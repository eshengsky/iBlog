var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    var worker;
    //遍历CPU核心数
    for (var i = 0; i < numCPUs; i++) {
        //生成新的工作进程运行主模块
        worker = cluster.fork();
        console.log('worker：%d 正在运行...', worker.process.pid);
    }
} else {
    //运行主模块
    require('./bin/www');
}

//监听退出事件
cluster.on('exit', function (worker, code, signal) {
    if (code !== 0) {
        console.error('worker：%d 异常退出（%s），30s后尝试重启...', worker.process.pid, signal || code);
        setTimeout(function () {
            var new_worker = cluster.fork();
            console.log('worker：%d 正在运行...', new_worker.process.pid);
        },30000);
    } else {
        console.log('worker：%d 正常退出！', worker.process.pid);
    }
});