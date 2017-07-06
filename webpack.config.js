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
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /index.html$/, use: {loader: 'file-loader', options: {name: 'index.html'}}},
      { // Currently used to load shaders into javascript files
        test: /\.[fv]s$/,
        use: ['raw-loader'],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'src'],
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
