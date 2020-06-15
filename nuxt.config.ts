import fs from 'fs';
import path from 'path';
import { Configuration } from '@nuxt/types/index';
import blogConfig from './blog.config';

const server: any = {
  host: blogConfig.host,
  port: blogConfig.port,
  timing: true
};
if (blogConfig.enableHTTPS) {
  server.https = {
    key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.crt'))
  };
}
const config: Configuration = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'iBlog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  server,
  serverMiddleware: ['@/server/api'],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f80' },
  /*
   ** Global CSS
   */
  css: [
    'ant-design-vue/dist/antd.less',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/static/main.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/axios', mode: 'server' },
    '@/plugins/ant-design',
    '@/plugins/font-awesome',
    '@/plugins/web-font/index',
    '@/plugins/event-bus',
    { src: '@/plugins/baidu-stats', mode: 'client' },
    { src: '@/plugins/tui-editor', mode: 'client' }
  ],
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/pwa'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'token.accessToken'
          },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/auth/login',
      home: '/'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: `${blogConfig.enableHTTPS ? 'https' : 'http'}://127.0.0.1:${blogConfig.port}`,
    browserBaseURL: '/'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend () {},
    cache: true,
    loaders: {
      less: {
        modifyVars: {
          // 'font-size-base': '16px',
          'outline-width': '0'
        },
        javascriptEnabled: true
      }
    },
    optimization: {
      splitChunks: {
        maxSize: 1000 * 2000
      }
    }
  },
  typescript: {
    typeCheck: {
      eslint: true
    }
  },
  watch: ['~/server']
};

export default config;
