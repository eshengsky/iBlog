if ('serviceWorker' in navigator) {
    let newWorker;
    const home_loading_timeout = 2000;
    const home_loading_begin = new Date();

    navigator.serviceWorker.register('/sw.js').then(reg => {
        // 不论是否已经安装sw，都会进到这里，所以在此处显示body
        document.body.classList.add('shown');
        reg.addEventListener('updatefound', () => {
            // 显示 loading 动画
            document.body.style.overflow = 'hidden';
            document.querySelector('#home-loading').style.display = 'block';
            newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                switch (newWorker.state) {
                    case 'installed':
                        const home_loading_end = new Date();
                        if (home_loading_end - home_loading_begin > home_loading_timeout) {
                            // 隐藏 loading 动画
                            document.querySelector('#home-loading').style.display = 'none';
                            document.body.style.overflow = 'auto';
                        } else {
                            var home_loading_timespan = home_loading_timeout - (home_loading_end - home_loading_begin);
                            setTimeout(function () {
                                // 隐藏 loading 动画
                                document.querySelector('#home-loading').style.display = 'none';
                                document.body.style.overflow = 'auto';
                            }, home_loading_timespan);
                        }
                        break;
                }
            });
        });
    });
} else {
    document.body.classList.add('shown');
}
