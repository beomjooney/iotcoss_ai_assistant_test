const express = require('express');
const next = require('next');
const vhost = require('vhost');

const port = process.env.NEXT_PUBLIC_PORT || 3001;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
  dev,
  // 개발 서버 성능 최적화
  customServer: true,
  quiet: false, // 로그 출력 활성화
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const mainServer = express();
  const dsuServer = express();
  const sejongServer = express();
  const dsuAiServer = express();
  const b2bServer = express();
  const b2cServer = express();
  const localServer = express();
  const devusServer = express();
  const skpQuizServer = express();
  const skpAiServer = express();

  // Serve static files from 'public/assets'
  dsuServer.use('/assets', express.static('public/assets'));
  sejongServer.use('/assets', express.static('public/assets'));
  b2bServer.use('/assets', express.static('public/assets'));
  b2cServer.use('/assets', express.static('public/assets'));
  localServer.use('/assets', express.static('public/assets'));
  devusServer.use('/assets', express.static('public/assets'));
  skpQuizServer.use('/assets', express.static('public/assets'));
  skpAiServer.use('/assets', express.static('public/assets'));

  dsuServer.get('/', (req, res) => {
    return app.render(req, res, '/dsu', req.query);
  });

  dsuServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/dsu/account/login', req.query);
  });

  dsuServer.all('*', (req, res) => {
    return handle(req, res);
  });

  sejongServer.get('/', (req, res) => {
    return app.render(req, res, '/iotcoss', req.query);
  });

  sejongServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/iotcoss/account/login', req.query);
  });

  sejongServer.all('*', (req, res) => {
    return handle(req, res);
  });

  dsuAiServer.get('/', (req, res) => {
    return app.render(req, res, '/dsuai', req.query);
  });

  dsuAiServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/dsuai/account/login', req.query);
  });

  dsuAiServer.all('*', (req, res) => {
    return handle(req, res);
  });

  b2bServer.get('/', (req, res) => {
    return app.render(req, res, '/ai', req.query);
  });

  b2bServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/ai/account/login', req.query);
  });

  b2bServer.all('*', (req, res) => {
    return handle(req, res);
  });

  b2cServer.get('/', (req, res) => {
    return app.render(req, res, '/quizup', req.query);
  });

  b2cServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/quizup/account/login', req.query);
  });

  b2cServer.all('*', (req, res) => {
    return handle(req, res);
  });

  localServer.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });

  localServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/account/login', req.query);
  });

  localServer.all('*', (req, res) => {
    return handle(req, res);
  });

  devusServer.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });

  devusServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/account/login', req.query);
  });

  devusServer.all('*', (req, res) => {
    return handle(req, res);
  });

  skpQuizServer.get('/', (req, res) => {
    return app.render(req, res, '/skpquiz', req.query);
  });

  skpQuizServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/skpquiz/account/login', req.query);
  });

  skpQuizServer.all('*', (req, res) => {
    return handle(req, res);
  });

  skpAiServer.get('/', (req, res) => {
    return app.render(req, res, '/skpai', req.query);
  });

  skpAiServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/skpai/account/login', req.query);
  });

  skpAiServer.all('*', (req, res) => {
    return handle(req, res);
  });

  mainServer.use(vhost('dsu.localhost', dsuServer));
  mainServer.use(vhost('devus.localhost', devusServer));
  mainServer.use(vhost('iotcoss.localhost', sejongServer));
  mainServer.use(vhost('dsuai.localhost', dsuAiServer));
  mainServer.use(vhost('ai.localhost', b2bServer));
  mainServer.use(vhost('quizup.localhost', b2cServer));
  mainServer.use(vhost('localhost', localServer));
  mainServer.use(vhost('skpquiz.localhost', skpQuizServer));
  mainServer.use(vhost('skpai.localhost', skpAiServer));
  mainServer.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
