const cluster = require('cluster');
const numCPUs = require('os')
    .cpus()
    .length;

if (cluster.isMaster) {
    let worker;

    // 遍历CPU核心数
    for (let i = 0; i < numCPUs; i++) {
        // 生成新的工作进程运行主模块
        worker = cluster.fork();
        console.log(`worker：${worker.process.pid} 正在运行...`);
    }
} else {
    // 运行主模块
    require('./bin/www');
}

// 监听退出事件
cluster.on('exit', (worker, code, signal) => {
    if (code !== 0) {
        console.error(`worker：${worker.process.pid} 异常退出（${signal || code}），5s后尝试重启...`);
        setTimeout(() => {
            const new_worker = cluster.fork();
            console.log(`worker：${new_worker.process.pid} 正在运行...`);
        }, 5000);
    } else {
        console.log(`worker：${worker.process.pid} 正常退出！`);
    }
});
