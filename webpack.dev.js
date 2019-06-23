module.exports = {
  devtool: 'eval',
  entry: './dist',
  output: {filename: 'app.min.js', path: `${__dirname}/public`},
  performance: {hints: false},
  mode: 'development'
};
