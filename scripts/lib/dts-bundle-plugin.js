const path = require('path');
const fs = require('fs-extra');

/**
 * This is a simple plugin wrapper to execute the dts bundler. This was
 * created as all the other bundlers had inherent issues or produced bad results
 */
function DtsBundlePlugin(options) {
  this.input = options.input || '';
  this.out = options.out || '';
}

DtsBundlePlugin.prototype.apply = function(compiler) {
  const input = this.input;
  const out = this.out;

  compiler.plugin('after-emit', function(compilation, callback) {
    const dts = require('dts-bundle');

    console.log('Bundling type declarations');
    dts.bundle({
      name: 'voidgl',
      main: path.join(input, '**/*.d.ts'),
      out: out,
      removeSource: true,
      outputAsModuleFolder: true,
    });

    // Before doing a major removal of files, make a timeout so the system
    // doesn't hang in limbo for eternity
    const timeoutId = setTimeout(() => {
      console.error('ERROR: Deleting type definition source files took too long!');
      callback();
    }, 30000);

    // Attempt the removal of the input source files
    fs.remove(input, err => {
      if (err) {
        console.error('ERROR: Could NOT delete type definition source files!');
        console.error(err.stack || err.message);
      }

      clearTimeout(timeoutId);
      callback();
    });
  });
};

module.exports = {
  DtsBundlePlugin
};
