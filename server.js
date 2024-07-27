const express = require('express');
const next = require('next');
const vhost = require('vhost');

// const port = process.env.PORT || 3001;
const port = process.env.NEXT_PUBLIC_PORT || 3001;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const mainServer = express();
  const adminServer = express();
  const sejongServer = express();
  const b2bServer = express();

  // Serve static files from '.next/static'
  adminServer.use('/_next/static', express.static(path.join(__dirname, '.next/static')));
  sejongServer.use('/_next/static', express.static(path.join(__dirname, '.next/static')));
  b2bServer.use('/_next/static', express.static(path.join(__dirname, '.next/static')));
  mainServer.use('/_next/static', express.static(path.join(__dirname, '.next/static')));

  // Serve static files from 'public/assets'
  adminServer.use('/assets', express.static('public/assets'));
  sejongServer.use('/assets', express.static('public/assets'));
  b2bServer.use('/assets', express.static('public/assets'));
  mainServer.use('/assets', express.static('public/assets'));

  adminServer.get('/', (req, res) => {
    return app.render(req, res, '/dsu', req.query);
  });

  adminServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/dsu/account/login', req.query);
  });

  adminServer.all('*', (req, res) => {
    return handle(req, res);
  });

  sejongServer.get('/', (req, res) => {
    return app.render(req, res, '/sejong', req.query);
  });

  sejongServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/sejong/account/login', req.query);
  });

  sejongServer.all('*', (req, res) => {
    return handle(req, res);
  });

  b2bServer.get('/', (req, res) => {
    return app.render(req, res, '/b2b', req.query);
  });

  b2bServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/b2b/account/login', req.query);
  });

  mainServer.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });

  mainServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/account/login', req.query);
  });

  mainServer.all('*', (req, res) => {
    return handle(req, res);
  });

  // adminServer.get('/*', (req, res) => {
  //   return app.render(req, res, `/dsu${req.path}`, req.query);
  // });

  // memberServer.get('/', (req, res) => {
  //   return app.render(req, res, '/member', req.query)
  // })

  // memberServer.get('/*', (req, res) => {
  //   return app.render(req, res, `/member${req.path}`, req.query)
  // })

  // memberServer.all('*', (req, res) => {
  //   return handle(req, res)
  // })

  mainServer.use(vhost('dsu.localhost', adminServer));
  mainServer.use(vhost('sejong.localhost', sejongServer));
  mainServer.use(vhost('b2b.localhost', b2bServer));
  mainServer.use(vhost('localhost', mainServer));
  // mainServer.use(vhost('lvh.me', memberServer))
  // mainServer.use(vhost('www.lvh.me', memberServer))
  mainServer.listen(port, err => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${port}`);
  });
});
