const {DtsBundlePlugin} = require('./scripts/lib/dts-bundle-plugin');
const {resolve} = require('path');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const tslintLoader = {loader: 'tslint-loader', options: {
  fix: true,
  emitErrors: true,
}};

const isRelease = process.env.NODE_ENV === 'release';
const isProduction = process.env.NODE_ENV === 'production' || isRelease;
const isDevelopment = process.env.NODE_ENV === 'development';

const plugins = [
  new ForkTsCheckerWebpackPlugin(),
];

let externals = [];
let library;
let libraryTarget;

if (isProduction) {
  // List our external libs for the library generation so they do
  // not get bundled into ours
  externals = [
    'd3-color',
    'd3-scale',
    'ramda',
    'react-dom',
    'react',
    'threejs',
  ];

  // We are bundling a library so set the output targets correctly
  library = 'voidgl';
  libraryTarget = 'umd';

  // Add our bundler as a plugin so we can perform the bundling AFTER webpack
  // has generated the proper files
  plugins.push(
    new DtsBundlePlugin({
      input: resolve('dist/src'),
      moduleName: library,
      out: path.join(resolve('dist'), 'index.d.ts'),
    })
  );
}

module.exports = {
  entry: isProduction ? './src' : './test',
  externals,

  module: {
    rules: [
      {test: /\.tsx?/, use: tslintLoader, enforce: 'pre'},
      {test: /\.tsx?/, use: {loader: 'ts-loader', options: {transpileOnly: isDevelopment}}},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /index.html$/, use: {loader: 'file-loader', options: {name: 'index.html'}}},
      {test: /\.[fv]s$/, use: ['raw-loader']}, // Currently used to load shaders into javascript files
    ],
  },

  output: {
    filename: isProduction ? 'index.js' : 'app.js',
    library,
    libraryTarget,
    path: isProduction ? resolve('dist') : resolve('build'),
    publicPath: '/',
  },

  plugins,

  resolve: {
    modules: ['./node_modules', './src'],
    extensions: ['.ts', '.tsx', '.js'],
  },
};
