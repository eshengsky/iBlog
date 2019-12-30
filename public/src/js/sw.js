/*
 * Service Worker
 * 如果要修改，请修改 public/src/js/sw.js 文件，根目录下的 sw 文件是自动生成的！
 */
importScripts('/nodeModules/workbox-sw/build/workbox-sw.js');
if (workbox) {
    workbox.setConfig({
        // 设置本地模块路径，否则默认会走谷歌CDN
        modulePathCb: moduleName => {
            return `/nodeModules/${moduleName}/build/${moduleName}.prod.js`;
        }
    });

    // 预缓存资源列表，需要自动生成
    workbox.precaching.precacheAndRoute([]);

    /**
     * 第三方CDN资源，采用 StaleWhileRevalidate 策略
     * 策略：当请求的路由有对应的 Cache 缓存结果就直接返回，
     * 在返回 Cache 缓存结果的同时会在后台发起网络请求拿到请求结果并更新 Cache 缓存，
     * 如果本来就没有 Cache 缓存的话，直接就发起网络请求并返回结果，这对用户来说是一种非常安全的策略
     */
    workbox.routing.registerRoute(
        'https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js',
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        'https://cdn.bootcss.com/highlight.js/9.12.0/styles/github.min.css',
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        'http://v3.jiathis.com/code/jia.js',
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        'https://hm.baidu.com/hm.js',
        new workbox.strategies.StaleWhileRevalidate()
    );

    /**
     * 本地资源，采用 CacheFirst 策略
     * 策略：当匹配到请求之后直接从 Cache 缓存中取得结果，
     * 如果 Cache 缓存中没有结果，才会发起网络请求，
     * 拿到网络请求结果并将结果更新至 Cache 缓存，并将结果返回给客户端
     */
    workbox.routing.registerRoute(
        new RegExp('.+\.(?:js|css|png|jpg|jpeg|svg|ico|swf|woff|woff2|eot|ttf")$'),
        new workbox.strategies.CacheFirst()
    );

    /**
     * 页面，采用 NetworkFirst 策略
     * 策略：优先尝试拿到网络请求的返回结果，
     * 如果拿到网络请求的结果，就将结果返回给客户端并且写入 Cache 缓存，
     * 如果网络请求失败，那最后被缓存的 Cache 缓存结果就会被返回到客户端
     */
    workbox.routing.registerRoute(
        function (context) {
            var origin = self.location.origin;
            var url = context.url.href;

            // 首页
            if (url === origin + '/') {
                return true;
            }

            // 博客及文章详情页
            if (url.indexOf(origin + '/blog') === 0) {
                return true;
            }

            // 留言
            if (url === origin + '/guestbook') {
                return true;
            }

            // 关于
            if (url === origin + '/about') {
                return true;
            }

            return false;
        },
        new workbox.strategies.NetworkFirst()
    );
}
