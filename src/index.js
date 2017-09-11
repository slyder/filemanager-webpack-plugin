const cpr = require('cpr');
const rimraf = require('rimraf');
const mv = require('mv');

class FileManagerPlugin {

  constructor(options) {

    this.options = this.setOptions(options);
    this.isWin = /^win/.test(process.platform);

    /* cpr options */
    this.cprOptions = {
      deleteFirst: true,
      overwrite: true,
      confirm: true
    };

  }

  setOptions(userOptions) {

    const defaultOptions = {
      verbose: false,
      onStart: {},
      onEnd: {}
    };

    for (const key in defaultOptions) {
      if (userOptions.hasOwnProperty(key)) {
        defaultOptions[key] = userOptions[key];
      }
    }

    return defaultOptions;

  }

  parseFileOptions(options) {

    const optKeys = Object.keys(options);

    for (let i = 0; i < optKeys.length; i++) {

      const fileAction = optKeys[i];
      const fileOptions = options[fileAction];

      switch (fileAction) {

        case 'copy':
          fileOptions.forEach(command => {
            if (!command.source || !command.destination) return;

            const cprOptions = Object.assign({}, this.cprOptions, { filter: command.filter });

            cpr(command.source, command.destination, cprOptions, (err, files) => {
              if (err) console.error(err);
            });
          });
          break;


        case 'move':
          fileOptions.forEach(command => {
            if (!command.source || !command.destination) return;

            mv(command.source, command.destination, (err) => {
              if (err) console.error(err);
            });
          });
          break;

        case 'delete':
          fileOptions.forEach(path => {
            rimraf(path, {}, (response) => {
              // handle error
            });
          });
          break;

        default:
          break;

      }

    }

  }

  apply(compiler) {

    compiler.plugin("compilation", (comp) => {

      if (this.options.verbose) {
        console.log("FileManagerPlugin: onStart");
      }

      if (this.options.onStart && Object.keys(this.options.onStart).length) {
        this.parseFileOptions(this.options.onStart);
      }

    });

    compiler.plugin('after-emit', (compliation, callback) => {

      if (this.options.verbose) {
        console.log("FileManagerPlugin: onEnd");
      }

      if (this.options.onEnd && Object.keys(this.options.onEnd).length) {
        this.parseFileOptions(this.options.onEnd);
      }

    });

  }

}

export default FileManagerPlugin;
