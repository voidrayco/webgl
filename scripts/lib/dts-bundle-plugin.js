const path = require('path');

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

    callback();
  });
};

module.exports = {
  DtsBundlePlugin
};
