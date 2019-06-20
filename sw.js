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
    "revision": "729adeb18d22ec3dc7dcd370df1ec3c1"
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
    "revision": "c1873b2be213829f17c7869ba875c797"
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
    "revision": "4203ca4868780a56950b9d22c9f89a98"
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
    "revision": "e5eec0350406024764ab4a8d741851ac"
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
    "revision": "b3d6132bbb27962b98e374e0e38b9d56"
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
    "revision": "0db76d1b2676a06114ff0b958b99ccf1"
  },
  {
    "url": "/static/dist/js/newarticle.js",
    "revision": "09a14fe702a49fa327e839bad1409f40"
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
    "revision": "621700a2a57bbe582a936990810223fa"
  },
  {
    "url": "/static/images/preview2.png",
    "revision": "e668889e93d0193946e6bc163a1edeb2"
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
    "revision": "f34cf8ce3e41fd8efd410a828d5df126"
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
    "revision": "22211a68383fcc12c4a25b5d25e17c4a"
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
    "revision": "a7b643d0c7e0befb1101674480bce4ef"
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
    "revision": "cd618558a738c198fcba01ee1463d818"
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
    "revision": "cce50368a57a22fa6b9eb48705ee7357"
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
    "url": "/static/src/js/highlight_line_number.js",
    "revision": "46e28b74d69247b91c80b056398aa0f0"
  },
  {
    "url": "/static/src/js/index.js",
    "revision": "f86dac258567ac544ac8f3ac7d03c4ed"
  },
  {
    "url": "/static/src/js/newarticle.js",
    "revision": "bf6d87056fd46c52b8d18697a9939e43"
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
    "url": "/static/ZeroClipboard.swf",
    "revision": "a573941f02f4331f81046356ebb667eb"
  },
  {
    "url": "/nodeModules/bootstrap/dist/css/bootstrap-theme.min.css",
    "revision": "2010fa9fb07541adc78a1ec0a8a4fbbf"
  },
  {
    "url": "/nodeModules/bootstrap/dist/css/bootstrap.min.css",
    "revision": "7f89537eaf606bff49f5cc1a7c24dbca"
  },
  {
    "url": "/nodeModules/bootstrap/dist/js/bootstrap.min.js",
    "revision": "2f34b630ffe30ba2ff2b91e3f3c322a1"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/all.min.css",
    "revision": "e4c542a7f6bf6f74fdd8cdf6e8096396"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/brands.min.css",
    "revision": "c9fcdfd0e53dec8552f9dd3b40f75973"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/fontawesome.min.css",
    "revision": "f87b6becf6c4595d38a59016c2460a0b"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/regular.min.css",
    "revision": "b7c0350118f1465ba68e3b7c93fcc360"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/solid.min.css",
    "revision": "cddcd8fd12da8dd6bcad774583afd75c"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/svg-with-js.min.css",
    "revision": "12a9e48af01b59c9e03476b1d0189c98"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/css/v4-shims.min.css",
    "revision": "d12f3b2a85c84ec27b7d27eec733af10"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.eot",
    "revision": "a7b95dbdd87e0c809570affaf366a434"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf",
    "revision": "98b6db59be947f563350d2284fc9ea36"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff",
    "revision": "2ef8ba3410dcc71578a880e7064acd7a"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2",
    "revision": "5e2f92123d241cabecf0b289b9b08d4a"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.eot",
    "revision": "dcce4b7fbd5e895561e18af4668265af"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf",
    "revision": "65b9977aa23185e8964b36eddbce7a20"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff",
    "revision": "427d721b86fc9c68b2e85ad42b69238c"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2",
    "revision": "e6257a726a0cf6ec8c6fec22821c055f"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot",
    "revision": "46e7cec623d8bd790d9fdbc8de2d3ee7"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf",
    "revision": "ff8d9f8adb0d09f11d4816a152672f53"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff",
    "revision": "a7140145ebaaf5fb14e40430af5d25c4"
  },
  {
    "url": "/nodeModules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2",
    "revision": "418dad87601f9c8abd0e5798c0dc1feb"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/css/jquery.fileupload-noscript.css",
    "revision": "77b97d2b03652874f0b4838f9092bbb2"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/css/jquery.fileupload-ui-noscript.css",
    "revision": "f95c01176c6a8e075aebd07ee2e84689"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/css/jquery.fileupload-ui.css",
    "revision": "1f4e0dd2d9441a6fc90d2a3ce0ca072f"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/css/jquery.fileupload.css",
    "revision": "ec8bd4e8c3a38562e96bcb8602516822"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/cors/jquery.postmessage-transport.js",
    "revision": "9522699d1ed0c2e95bdfb08cabd4b8e2"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/cors/jquery.xdr-transport.js",
    "revision": "8a21ee58e9eba7e01d5dd8b3c7364cf5"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-angular.js",
    "revision": "398579ad6380c370efbb2918da088fd0"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-audio.js",
    "revision": "a7234dfb696e4248614b79f95478da89"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-image.js",
    "revision": "7c40367b00f74b0c7c43bff009dde942"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-jquery-ui.js",
    "revision": "253cd8d55b224c72333ce88337a1edb3"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-process.js",
    "revision": "840f65232eaf1619ea0aff1ab4f5e444"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-ui.js",
    "revision": "d41e8e8fa1811ff6e0ff5b8f541f3203"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-validate.js",
    "revision": "a144e6149c89ed27e0b2d7fcfef09101"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload-video.js",
    "revision": "0a9ee295c77f8a09bd4aac114171ed62"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.fileupload.js",
    "revision": "4bfd85460689a29e314ddfad50c184e0"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/jquery.iframe-transport.js",
    "revision": "f371e8d9f57329f90114d7b52dd5c7a4"
  },
  {
    "url": "/nodeModules/blueimp-file-upload/js/vendor/jquery.ui.widget.js",
    "revision": "3d0f0f5ca5d86c5a4b4fc33cda374a17"
  },
  {
    "url": "/nodeModules/sweetalert/dist/sweetalert-dev.js",
    "revision": "800cbdcad6a26e06fc9471102d8c50c4"
  },
  {
    "url": "/nodeModules/sweetalert/dist/sweetalert.css",
    "revision": "196c08c89f0c8a9b688a16d3435ac327"
  },
  {
    "url": "/nodeModules/sweetalert/dist/sweetalert.min.js",
    "revision": "0068f44b0aa1b83fa7679860ceb26590"
  },
  {
    "url": "/nodeModules/jquery/dist/jquery.js",
    "revision": "888d4551b8db7c41cda28d95e494f998"
  },
  {
    "url": "/nodeModules/jquery/dist/jquery.min.js",
    "revision": "2f6b11a7e914718e0290410e85366fe9"
  },
  {
    "url": "/nodeModules/metismenu/dist/cjs/index.js",
    "revision": "e3a81aadc90300392b78d40ff223b5cf"
  },
  {
    "url": "/nodeModules/metismenu/dist/metisMenu.css",
    "revision": "31ffb62ccdea9a6362112e37a70a7ffc"
  },
  {
    "url": "/nodeModules/metismenu/dist/metisMenu.js",
    "revision": "f0ec5be1b3831cbda70f751151c93130"
  },
  {
    "url": "/nodeModules/metismenu/dist/metisMenu.min.css",
    "revision": "990c79a10309155c5b46ced8f6b88f57"
  },
  {
    "url": "/nodeModules/metismenu/dist/metisMenu.min.js",
    "revision": "a6b9a45de9e973ebe0079ff0ec5d1637"
  },
  {
    "url": "/nodeModules/metismenu/dist/modules/index.js",
    "revision": "38f8b096d5a1e575075a7328f2fc1f90"
  },
  {
    "url": "/nodeModules/lodash/core.min.js",
    "revision": "a6979ad394d6e0da7f690e7be5e29b8f"
  },
  {
    "url": "/nodeModules/lodash/lodash.min.js",
    "revision": "62acde2a2687c63954bee264a1a2f86d"
  },
  {
    "url": "/nodeModules/fuelux/dist/css/fuelux.css",
    "revision": "0c9709e631eb1b860cdec4bf4e9d26f0"
  },
  {
    "url": "/nodeModules/fuelux/dist/css/fuelux.min.css",
    "revision": "ea5e075186850395d225c2598a6622ce"
  },
  {
    "url": "/nodeModules/fuelux/dist/js/fuelux.js",
    "revision": "fcdd9209f24b83aea99bbbd8c3b87c96"
  },
  {
    "url": "/nodeModules/fuelux/dist/js/fuelux.min.js",
    "revision": "5135a3abcff5a71f964ed09631cbe4d6"
  },
  {
    "url": "/nodeModules/simplemde/dist/simplemde.min.css",
    "revision": "b8697c785bbf0627fb05a7d32efea0c2"
  },
  {
    "url": "/nodeModules/simplemde/dist/simplemde.min.js",
    "revision": "fd052f831c01ff10535c0ae2b538dc8b"
  },
  {
    "url": "/nodeModules/js-md5/build/md5.min.js",
    "revision": "c3a7222388987b8d12694736f6ef1595"
  },
  {
    "url": "/nodeModules/animate.css/animate.min.css",
    "revision": "c78e4003414fbf2814dc097a5e1c784a"
  },
  {
    "url": "/nodeModules/lightbox2/dist/css/lightbox.min.css",
    "revision": "767938d77eef356b1ba76c3897384948"
  },
  {
    "url": "/nodeModules/lightbox2/dist/js/lightbox-plus-jquery.min.js",
    "revision": "85b4b81c0b2d9fd16b9ea0458b56b064"
  },
  {
    "url": "/nodeModules/lightbox2/dist/js/lightbox.min.js",
    "revision": "754f3b83f87764db45e3adafea8c5720"
  },
  {
    "url": "/nodeModules/scrollnav/dist/jquery.scrollNav.min.js",
    "revision": "5a34ddb1e7f72f61f6de275201d619b1"
  },
  {
    "url": "/nodeModules/jquery-qrcode/dist/jquery-qrcode.min.js",
    "revision": "21f28eca4fb04c36d8e09b15e364950b"
  },
  {
    "url": "/nodeModules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js",
    "revision": "9df3cfdcc9b72f1aa24e2e114455ae7a"
  },
  {
    "url": "/nodeModules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css",
    "revision": "295351a5027c5ad6256f3389ab471cfb"
  },
  {
    "url": "/nodeModules/malihu-custom-scrollbar-plugin/mCSB_buttons.png",
    "revision": "3a8a4582fe1dbc77086eccca317c459e"
  },
  {
    "url": "/nodeModules/jQuery-cycleText/dist/js/jquery.cycleText.min.js",
    "revision": "27c6d2d12a22270de12f1e58f5f1fc23"
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
