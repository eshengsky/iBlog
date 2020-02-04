import { IBlogConfig } from '@/types';

const config: IBlogConfig = {
  host: '0.0.0.0',
  port: 9000,
  enableHTTPS: false,
  mongoUrl: 'mongodb://localhost:27017/iBlog_v2',
  jwtSecret: 'myblogjsonwebtokensecretkey'
};

export default config;
