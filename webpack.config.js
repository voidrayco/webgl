const {resolve} = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const tslintLoader = {loader: 'tslint-loader', options: {
  fix: true,
  emitErrors: true,
  // failOnHint: true,
}};

const isRelease = process.env.NODE_ENV === 'RELEASE';
const isProduction = process.env.NODE_ENV === 'PRODUCTION' || isRelease;
const isDevelopment = process.env.NODE_ENV === 'DEVELOP';

module.exports = {
  entry: isProduction ? './src' : './test',
  module: {
    rules: [
      {test: /\.tsx?/, use: tslintLoader, enforce: 'pre'},
      {test: /\.tsx?/, use: {loader: 'ts-loader', options: {transpileOnly: true}}},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /index.html$/, use: {loader: 'file-loader', options: {name: 'index.html'}}},
      {test: /\.[fv]s$/, use: ['raw-loader']}, // Currently used to load shaders into javascript files
    ],
  },
  resolve: {
    modules: ['./node_modules', './src'],
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: isProduction ? 'index.js' : 'app.js',
    path: isProduction ? resolve('dist') : resolve('build'),
    publicPath: '/',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};
