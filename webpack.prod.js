module.exports = {
  entry: './dist',
  output: {filename: 'app.min.js', library: 'mangaloyalty', libraryTarget: 'umd', path: `${__dirname}/public`},
  performance: {hints: false},
  mode: 'production'
};
