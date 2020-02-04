import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import indexRoute from './routes/index';
import adminRoute from './routes/admin';
import authRoute from './routes/auth';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use(indexRoute);

// Error
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    return res.sendStatus(401);
  }
  console.error('api route error', err);
  res.sendStatus(err.statusCode || 500);
});

module.exports = {
  path: '/api',
  handler: app
};
