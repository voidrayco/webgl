const path = require('path');
const fs = require('fs-extra');

/**
 * This is a simple plugin wrapper to execute the dts bundler. This was
 * created as all the other bundlers had inherent issues or produced bad results.
 *
 * @param {any} options The configuration options for this plugin
 * {
 *   input: The input directory of all the typings to be bundled. Note: this MUST
 *          be a directory which MUST contain an index.d.ts. The index file will
 *          be ignored and is there primarily so webpack will include all of the
 *          necessary type files generated. The bundler will blindly add ALL type
 *          files in this directory and subdirectories.
 *   out: The output file for the bundled typings
 *   moduleName: The name of the module (should === the name property in package.json)
 * }
 *
 * @return {void}
 */
function DtsBundlePlugin(options) {
  this.options = options;
}

DtsBundlePlugin.prototype.apply = function(compiler) {
  const input = this.options.input || '';
  const out = this.options.out || '';
  const moduleName = this.options.moduleName;

  compiler.plugin('after-emit', function(compilation, callback) {
    const dts = require('dts-bundle');
    const filesIncluded = new Map();

    console.log('Bundling type declarations', input);
    dts.bundle({
      // baseDir: input,
      indent: '  ',
      name: moduleName,
      main: path.join(input, '**/*.d.ts'),
      // main: path.join(input, 'index.d.ts'),
      out: out,
      removeSource: true,
      outputAsModuleFolder: true,
      module: 'commonjs',
      verbose: false,

      /**
       * This handles a bug witht he bundler where the entry file causes a duplicate
       * item to be produced for every item included in the index file
       * @param {string} filename The file name the bundler is considering to add
       * @return {boolean} Returns true if the file is to be excluded
       */
      exclude: filename => {
        if (filename === 'index.d.ts')
          return true;

        if (filesIncluded.get(filename))
          return true;

        console.log(filename);
        filesIncluded.set(filename, true);
      },
    });

    // Clear out any roots that may have been imported
    // NOTE: A timeout is used as there is not a terribly reliable way to determining
    // when the type bundler has finished it's task. A File watcher could be used,
    // but those aren't reliable either according to node docs
    setTimeout(() => {
      let file = fs.readFileSync(out, 'utf8');
      const files = fs.readdirSync(input);

      // console.log(file.match(new RegExp('import.+from.+', 'g')));

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

      // We need the module declaration to exist. Could not get the bundler to
      // handle this in an appropriate way, so we simply wrap the beginning and the
      // end with the module name
      file = `declare module "${moduleName}" {\n${file}\n}`;

      fs.writeFileSync(out, file, 'utf8');
      callback();
    }, 2000);
  });
};

module.exports = {
  DtsBundlePlugin
};
