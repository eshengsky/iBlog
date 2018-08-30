const i18n = require('i18n');

// multi language support
i18n.configure({
    // setup some locales - other locales default to en silently
    locales: ['zh-CN', 'en-US'],

    // sets a custom cookie name to parse locale settings from
    cookie: 'locale',

    // query parameter to switch locale (ie. /home?locale=en) - defaults to NULL
    queryParameter: 'locale',

    // you may alter a site wide default locale
    defaultLocale: 'zh-CN',

    // enable object notation in order to use nested translation
    objectNotation: true,

    // sync locale information accros all files - defaults to false
    syncFiles: false,

    // where to store json files - defaults to './locales'
    directory: `${__dirname}/../language`
});

module.exports = i18n;
