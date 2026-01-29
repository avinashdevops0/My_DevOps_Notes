const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

const proxy = httpProxy.createProxyServer();

// Proxy routes
app.use('/users', (req, res) => {
  proxy.web(req, res, { target: 'http://users-service:3001' });
});

app.use('/products', (req, res) => {
  proxy.web(req, res, { target: 'http://products-service:3002' });
});

app.use('/orders', (req, res) => {
  proxy.web(req, res, { target: 'http://orders-service:3003' });
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
