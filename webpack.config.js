const {resolve} = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const tslintLoader = {loader: 'tslint-loader', options: {
  fix: true,
  emitErrors: true,
  // failOnHint: true,
}};

module.exports = {
  entry: './src',
  module: {
    rules: [
      {test: /\.tsx?/, use: tslintLoader, enforce: 'pre'},
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
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};
