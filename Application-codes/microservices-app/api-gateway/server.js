const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

function proxyService(basePath, target) {
  app.all(basePath, (req, res) => {
    proxy.web(req, res, { target });
  });
  app.all(`${basePath}/*`, (req, res) => {
    proxy.web(req, res, { target });
  });
}

proxyService('/users', 'http://users-service:3001');
proxyService('/products', 'http://products-service:3002');
proxyService('/orders', 'http://orders-service:3003');

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
