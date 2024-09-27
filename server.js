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
  const dsuServer = express();
  const sejongServer = express();
  const b2bServer = express();
  const localServer = express();
  const devusServer = express();

  // Serve static files from 'public/assets'
  dsuServer.use('/assets', express.static('public/assets'));
  sejongServer.use('/assets', express.static('public/assets'));
  b2bServer.use('/assets', express.static('public/assets'));
  localServer.use('/assets', express.static('public/assets'));
  devusServer.use('/assets', express.static('public/assets'));

  dsuServer.get('/', (req, res) => {
    return app.render(req, res, '/dsu', req.query);
  });

  dsuServer.get('/account/login', (req, res) => {
    return app.render(req, res, '/dsu/account/login', req.query);
    // return app.render(req, res, '/account/login', req.query);
  });

  dsuServer.all('*', (req, res) => {
    return handle(req, res);
  });

  sejongServer.get('/', (req, res) => {
    return app.render(req, res, '/iotcoss', req.query);
  });

  sejongServer.get('/account/login', (req, res) => {
    // return app.render(req, res, '/account/login', req.query);
    return app.render(req, res, '/iotcoss/account/login', req.query);
  });

  sejongServer.all('*', (req, res) => {
    return handle(req, res);
  });

  b2bServer.get('/', (req, res) => {
    return app.render(req, res, '/ai', req.query);
  });

  b2bServer.get('/account/login', (req, res) => {
    // return app.render(req, res, '/account/login', req.query);
    return app.render(req, res, '/ai/account/login', req.query);
  });

  b2bServer.all('*', (req, res) => {
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

  mainServer.use(vhost('dsu.localhost', dsuServer));
  mainServer.use(vhost('devus.localhost', devusServer));
  mainServer.use(vhost('iotcoss.localhost', sejongServer));
  mainServer.use(vhost('ai.localhost', b2bServer));
  mainServer.use(vhost('localhost', localServer));

  // mainServer.use(vhost('lvh.me', memberServer))
  // mainServer.use(vhost('www.lvh.me', memberServer))
  mainServer.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
