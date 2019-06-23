// Initialize the server.
const express = require('express');
const server = express();
server.disable('x-powered-by');

// Initialize the server compiler.
try {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackCompiler = webpack(require('./webpack.dev.js'));
  server.use(webpackMiddleware(webpackCompiler));
} catch {}

// Initialize the server router.
server.use(express.static(`${__dirname}/public`));
server.listen(7767, () => {
  console.log(`Client running on http://localhost:7767/`);
});
