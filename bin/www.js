const app = require('../app');
const ssl = require('../config.json').ssl;
const serverlog = require('serverlog-node');
const logger = serverlog.getLogger('www');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

let server;
if (ssl.enable) {
    // 创建 HTTPS
    const https = require('https');
    const fs = require('fs');
    try {
        const privateKey  = fs.readFileSync(ssl.key, 'utf8');
        const certificate = fs.readFileSync(ssl.cert, 'utf8');
        server = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);
    } catch (err) {
        logger.error('未能成功读取SSL私钥或证书文件！Error:', err);
        process.exit(1);
    }
} else {
    // 创建 HTTP
    const http = require('http');
    server = http.createServer(app);
}
server.listen(port, () => {
    logger.info('iBlog2 listening on port', port, 'with pid', process.pid);
});
server.on('error', onError);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ?
        `Pipe ${port}` :
        `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
