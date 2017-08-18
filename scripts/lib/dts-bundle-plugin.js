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

    console.log('Bundling type declarations', input);
    dts.bundle({
      baseDir: input + '  ',
      indent: '  ',
      name: 'voidgl',
      main: path.join(input, '**/*.d.ts'),
      out: out,
      removeSource: true,
      outputAsModuleFolder: true,
      module: 'commonjs',
      verbose: false,

      exclude: (filename, isExternal) => {
        console.log(filename, isExternal);
        return filename === 'index.d.ts';
      },
    });

    // Clear out any roots that may have been imported
    // NOTE: A timeout is used as there is not a teribly reliable way to determining
    // when the type bundler has finished it's task
    setTimeout(() => {
      let file = fs.readFileSync(out, 'utf8');
      const files = fs.readdirSync(input);

      // Our system uses roots in the webpack configuration making statements
      // like 'webgl-surface/blah/blah' possible. Our bundler blindly adds all
      // items in our src in our bundle, but it gets confused about roots and
      // has no way to specify roots for it. Thus it thinks it's an external and
      // attempts to import them. Since the class is included already from the
      // blind inclusion, we need to just eliminate the imports to our internal
      // root modules, but leave the imports for the third party lib types.
      files.forEach(filename => {
        file = file.replace(new RegExp(`import.+${filename}.+`, 'g'), '');
      });

      fs.writeFileSync(out, file, 'utf8');
      callback();
    }, 2000);
  });
};

module.exports = {
  DtsBundlePlugin
};
