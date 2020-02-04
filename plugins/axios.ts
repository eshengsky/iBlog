import https from 'https';
export default ({ $axios }) => {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

  $axios.onRequest(config => {
    config.startTime = Date.now();
    console.info('发起请求 ' + config.url);
  });

  $axios.onError(err => {
    console.error(err);
  });

  $axios.onResponse(resp => {
    const mill = 1000;
    const costTime = (Date.now() - resp.config.startTime) / mill;
    console.info(`请求 ${resp.config.url} 已完成！响应耗时：${costTime}s，状态码：${resp.status}`);
  });
};
