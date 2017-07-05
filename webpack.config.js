const {resolve} = require('path');

module.exports = {
  entry: './src',
  module: {
    rules: [
      {test: /\.tsx?/, use: {loader: 'ts-loader', options: {transpileOnly: true}}},
      {test: /index.html$/, use: {loader: 'file-loader', options: {name: 'index.html'}}},
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: 'app.js',
    path: resolve('build'),
    publicPath: '/',
  },
};
