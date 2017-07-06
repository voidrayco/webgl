const {resolve} = require('path');

module.exports = {
  entry: './src',
  module: {
    rules: [
      {test: /\.tsx?/, use: {loader: 'ts-loader', options: {transpileOnly: true}}},
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
};
