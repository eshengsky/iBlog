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
    workbox.precaching.precacheAndRoute([
  {
    "url": "/static/dist/css/account.css",
    "revision": "aa23ca80b739e9b79c4bd044af9499d7"
  },
  {
    "url": "/static/dist/css/admin.css",
    "revision": "055dc6c46644058ad5c3e36a47ccee28"
  },
  {
    "url": "/static/dist/css/animate-custom.css",
    "revision": "d2ee2fe9634ec2d2115c949fc4201364"
  },
  {
    "url": "/static/dist/css/bootstrap-addon.css",
    "revision": "98912f397c55aad32678fc7dc1860544"
  },
  {
    "url": "/static/dist/css/dark_theme_code.css",
    "revision": "bb33509d793fde7cf6ea5431e410740e"
  },
  {
    "url": "/static/dist/css/error.css",
    "revision": "fd75f1ea9b0ed5f666182d8fabec52ca"
  },
  {
    "url": "/static/dist/css/github-markdown.css",
    "revision": "327040a7d779e93642c3dd98abf7dba5"
  },
  {
    "url": "/static/dist/css/home-loading.css",
    "revision": "d8d57135f44a3ca78e3b0b945a5d99bf"
  },
  {
    "url": "/static/dist/css/icon-font.css",
    "revision": "e0ffda7bd1f1d55105a62b8f6260d448"
  },
  {
    "url": "/static/dist/css/monokai-sublime.css",
    "revision": "b4787837acf01460e08a4d14b0db08ac"
  },
  {
    "url": "/static/dist/css/posts_style_custom.css",
    "revision": "e0cc4825c1e0787844c849596cc2c581"
  },
  {
    "url": "/static/dist/css/selectlist.css",
    "revision": "a6fd9acad9a4668112952fe3f6749edd"
  },
  {
    "url": "/static/dist/css/share.css",
    "revision": "c1322445c891ab76df414737e84598de"
  },
  {
    "url": "/static/dist/css/site.css",
    "revision": "b9af29af14ca66646db81b4924d72ec5"
  },
  {
    "url": "/static/dist/js/about.js",
    "revision": "cdc773903a708003e57abc389aedcf12"
  },
  {
    "url": "/static/dist/js/aboutmanage.js",
    "revision": "00c866b42d0300fa8f2a16c5d4056a9a"
  },
  {
    "url": "/static/dist/js/account.js",
    "revision": "e2cdab522742840e4ef83d6013f5e946"
  },
  {
    "url": "/static/dist/js/admin.js",
    "revision": "6e88ab7fac1cc2397b0db29f3c19c102"
  },
  {
    "url": "/static/dist/js/article.js",
    "revision": "79aaf4d140a17b5f7029543057c57c58"
  },
  {
    "url": "/static/dist/js/articlemanage.js",
    "revision": "dac35dc0df4b608416a398d9800b72c1"
  },
  {
    "url": "/static/dist/js/cachemanage.js",
    "revision": "f1270de01feb5a0ad425705014e55d79"
  },
  {
    "url": "/static/dist/js/category.js",
    "revision": "862d4640170ee09daf40fd8d5e531435"
  },
  {
    "url": "/static/dist/js/categorymanage.js",
    "revision": "35b7a8fde8e24d0dce35e6dfd652dd19"
  },
  {
    "url": "/static/dist/js/dateFormat.js",
    "revision": "2b3c2406d8a2346aec9bc655a4b85690"
  },
  {
    "url": "/static/dist/js/editarticle.js",
    "revision": "0dcae8a90c481ddfb93ffef3421b19ec"
  },
  {
    "url": "/static/dist/js/exception.js",
    "revision": "57bc925245a5a3102a72b3762a277bae"
  },
  {
    "url": "/static/dist/js/guestbook.js",
    "revision": "c00f0ecf07388713abb4d9b3baf41f68"
  },
  {
    "url": "/static/dist/js/highlight_line_number.js",
    "revision": "38197c0c0f1499e19e5dd3b1c1c84e86"
  },
  {
    "url": "/static/dist/js/index.js",
    "revision": "535a63332e046f8c1d8dd7afc138ad91"
  },
  {
    "url": "/static/dist/js/newarticle.js",
    "revision": "b3431aaeb6f9e0cbc049fec2867a62f1"
  },
  {
    "url": "/static/dist/js/prehandler.js",
    "revision": "be4a1a637867a17d66c5b41546068b42"
  },
  {
    "url": "/static/dist/js/selectlist.js",
    "revision": "c93bd4f0f1b30dc44235e5c16864ce0c"
  },
  {
    "url": "/static/dist/js/settings.js",
    "revision": "51b62f705867412129e1f15c6f9ddbbb"
  },
  {
    "url": "/static/dist/js/top.js",
    "revision": "fbbdcfceccf821b4d092005b30a5b74f"
  },
  {
    "url": "/favicon.ico",
    "revision": "bcbc257b2ed07389e6402f04f3790de3"
  },
  {
    "url": "/static/images/code-bk.png",
    "revision": "012acbe788ee429da8d7d8d619455fc8"
  },
  {
    "url": "/static/images/ErrorBack.jpg",
    "revision": "656655008a3546310107171c727d1e50"
  },
  {
    "url": "/static/images/filterBar.png",
    "revision": "f9c64669285b23c2fa712208cd3ed6d5"
  },
  {
    "url": "/static/images/header-profile.png",
    "revision": "2a634a94d5b175c41a71fac233a52f53"
  },
  {
    "url": "/static/images/preview1.png",
    "revision": "3a69a936b49612c2d7094c03dac4fc5f"
  },
  {
    "url": "/static/images/preview2.png",
    "revision": "2fb815f85212a5d3a952baea77c57d56"
  },
  {
    "url": "/static/images/preview3.png",
    "revision": "2649fa08b9721e2a7352a819ec933da1"
  },
  {
    "url": "/static/images/s1.jpg",
    "revision": "ffaae6281cd7adfd3768b4318e8383c5"
  },
  {
    "url": "/static/images/s2.jpg",
    "revision": "597fbd0a7bc16307d75c8065ca7589b6"
  },
  {
    "url": "/static/images/s3.jpg",
    "revision": "a17310883c207097ba42a32154dc205b"
  },
  {
    "url": "/static/images/youlunhb.jpg",
    "revision": "4143eb0f020c86bcd1457c1943bd1d3c"
  },
  {
    "url": "/static/images/zhr.jpg",
    "revision": "cc21e17dd614e359b6223f0dea7d482c"
  },
  {
    "url": "/static/images/全部分类.svg",
    "revision": "efcbb3a3a0f41a483e5ab440b57878a2"
  },
  {
    "url": "/static/images/未分类.svg",
    "revision": "bf438f5e068df9a578f8e73cdadf9370"
  },
  {
    "url": "/static/src/css/account.css",
    "revision": "fea17873f32909f7381434bf8d837bb6"
  },
  {
    "url": "/static/src/css/admin.css",
    "revision": "ace3c39f5d191bdad000aafa850c2e24"
  },
  {
    "url": "/static/src/css/animate-custom.css",
    "revision": "8ebdaa42b70692a35702fb168b2c4f87"
  },
  {
    "url": "/static/src/css/bootstrap-addon.css",
    "revision": "2de958c72428113023139b629bdf3036"
  },
  {
    "url": "/static/src/css/dark_theme_code.css",
    "revision": "95f6fecd02ab30ea03365f26280738a6"
  },
  {
    "url": "/static/src/css/error.css",
    "revision": "111e28bd221159f24912396b00ea3a64"
  },
  {
    "url": "/static/src/css/github-markdown.css",
    "revision": "53b68d66c30e94646961bf0151ac42ce"
  },
  {
    "url": "/static/src/css/home-loading.css",
    "revision": "b65e14aca9079b322da083198c33b590"
  },
  {
    "url": "/static/src/css/icon-font.css",
    "revision": "ba4c6929587fe18676c6f86c294d7eef"
  },
  {
    "url": "/static/src/css/monokai-sublime.css",
    "revision": "7956f127b62d3a799347b00fd2d71825"
  },
  {
    "url": "/static/src/css/posts_style_custom.css",
    "revision": "f90dd10040b94d222d315af5e1814725"
  },
  {
    "url": "/static/src/css/selectlist.css",
    "revision": "fcb98657b4807489fb525ed891f189ee"
  },
  {
    "url": "/static/src/css/share.css",
    "revision": "0edc4d28acbc11b61c8f1196b7824192"
  },
  {
    "url": "/static/src/css/site.css",
    "revision": "d867e43098e168aa47d70cc2fcb211f1"
  },
  {
    "url": "/static/src/js/about.js",
    "revision": "c953f9050ba9a3dab72c5d9e3354e1fa"
  },
  {
    "url": "/static/src/js/aboutmanage.js",
    "revision": "55f2aedf7662436c53e8e59b2cdf7750"
  },
  {
    "url": "/static/src/js/account.js",
    "revision": "cf120e324080c73e8b7a5f832205daf5"
  },
  {
    "url": "/static/src/js/admin.js",
    "revision": "227cdee0c00cc768db90a171e02bf94b"
  },
  {
    "url": "/static/src/js/article.js",
    "revision": "b6514181e51b205a59adf57e1f41812c"
  },
  {
    "url": "/static/src/js/articlemanage.js",
    "revision": "4549a9606d841fda707086212cefcdea"
  },
  {
    "url": "/static/src/js/cachemanage.js",
    "revision": "f43a0d23f0719f249815b84f927a18eb"
  },
  {
    "url": "/static/src/js/category.js",
    "revision": "03f8eb2e3d603c936a5d80d05335cf90"
  },
  {
    "url": "/static/src/js/categorymanage.js",
    "revision": "818267d7988fb9dfedfb5694a55b9d62"
  },
  {
    "url": "/static/src/js/dateFormat.js",
    "revision": "9d8d4c63e06b4804c985074e55518c25"
  },
  {
    "url": "/static/src/js/editarticle.js",
    "revision": "287ab0f1f9114a34d09a963aa5b0ad56"
  },
  {
    "url": "/static/src/js/exception.js",
    "revision": "0bcfc6c3d782acdf0b5a7a076acb61b3"
  },
  {
    "url": "/static/src/js/guestbook.js",
    "revision": "c5440a16034df3ae132aa391cc5e5c92"
  },
  {
    "url": "/static/src/js/index.js",
    "revision": "94c5e685de18bbd298e0ee5fd6063c12"
  },
  {
    "url": "/static/src/js/newarticle.js",
    "revision": "03c19987c40b70738c9f823ebb805a61"
  },
  {
    "url": "/static/src/js/prehandler.js",
    "revision": "bc8f6d7b5aa98c92293aa685597b7913"
  },
  {
    "url": "/static/src/js/selectlist.js",
    "revision": "804f9a60c7597f419a7451e9bd6caa6b"
  },
  {
    "url": "/static/src/js/settings.js",
    "revision": "372bb368ae06752a73c90715c21a86ca"
  },
  {
    "url": "/static/src/js/top.js",
    "revision": "1497bc2af110a7585d484cc97b73d492"
  },
  {
    "url": "/static/uploads/415gQEpsx/file/prev_EkGnX4Tog.png",
    "revision": "84b76dee6b27b795e89e3649078a11c2"
  },
  {
    "url": "/static/uploads/415gQEpsx/img/zhr_VJH5Q4asx.jpg",
    "revision": "cc21e17dd614e359b6223f0dea7d482c"
  },
  {
    "url": "/static/uploads/QtcjVQ8GpE/img/品牌馆@3x_ChIGWeJkLb.png",
    "revision": "c513d36d407f28668c8bf0d4126381ef"
  },
  {
    "url": "/static/uploads/zQy02fdv4/img/prev_en_Nl4FDClFym.png",
    "revision": "bb55cd09f52293a8aad365f0b4eb6c36"
  },
  {
    "url": "/static/ZeroClipboard.swf",
    "revision": "a573941f02f4331f81046356ebb667eb"
  }
]);

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
        'https://v3.jiathis.com/code/jia.js',
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
