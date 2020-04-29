module.exports = {
  entry: './dist/app',
  output: {filename: 'app.min.js', path: `${__dirname}/public`},
  performance: {hints: false},
  mode: 'production'
};
