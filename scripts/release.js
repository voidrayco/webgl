const { dirname } = require('path');
const { readFile } = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');
const { writeFile } = require('fs');
const debug = require('debug')('isenpai:build');
const mkdirp = require('mkdirp');
const tar = require('tar');
const toPromise = require('./lib/toPromise');
const webpack = require('webpack');

const OUT_FOLDER = resolve('dist');

process.env.NODE_ENV = 'RELEASE';

let NO_BUILD = false;
let VERSION = null;

debug('OUT_FOLDER: %o', OUT_FOLDER);

for (let i = 2; i < process.argv.length; ++i) {
  const arg = process.argv[i];

  switch (arg) {
    case '--no-build':
    case '--nobuild':
      NO_BUILD = true;
      break;
    case '--version':
      VERSION = process.argv[++i];
      break;
    default:
      throw new Error('Invalid Argument ' + arg);
  }
}

async function shell(command, args) {
  return new Promise((resolve, reject) => {
    let STDOUT = '';
    let STDERR = '';
    const child = spawn(command, args);
    child.stdout.on('data', buffer => {
      STDOUT += buffer.toString();
    });
    child.stderr.on('data', buffer => {
      STDERR += buffer.toString();
    });
    child.on('close', () => {
      if (STDERR) reject(STDERR);
      else resolve(STDOUT);
    });
  });
}

async function webpackBuild() {
  const config = require(resolve('webpack.config.js'));
  config.devtool = 'source-map';
  return toPromise(c => webpack(config, c));
}

async function build() {
  console.log('Building application...');
  // Make the build folder
  await toPromise(c => mkdirp(OUT_FOLDER, c));
  // Make web pack do the build
  if (!NO_BUILD) await webpackBuild();
}

async function bumpVersion() {
  //
  // Update the app.conf
  //
  if (!VERSION) {
    console.log('No version specified. Will not create a version');
    return;
  }

  //
  // Update package.json
  //
  const PACKAGE_JSON = resolve('package.json');
  let json = require(PACKAGE_JSON);
  json.version = VERSION;
  json = JSON.stringify(json, null, '  ');
  await toPromise(c => writeFile('package.json', json, c));

  //
  // Create git tag
  //
  await shell('git', ['commit', '-m', `Version ${VERSION}`,
    OUT_FOLDER,
    PACKAGE_JSON,
  ]);
  await shell('git', ['tag', '-a', VERSION, '-m', `Version ${VERSION}`])
  .then(() => console.log(`Created tag ${VERSION}`));
}

build()
.then(bumpVersion)
.catch(e => console.log('ERROR', e))
;
