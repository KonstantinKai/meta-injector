import * as rollup from 'rollup';
import { terser } from 'rollup-plugin-terser';
const filesize = require('rollup-plugin-filesize');

function getRollupOptions(options: rollup.RollupOptions) {
  const minify = terser({
    mangle: {
      properties: {
        regex: /^_/i,
      }
    }
  });

  const foundIndex = (options.plugins ?? []).findIndex((plugin) => (plugin as rollup.Plugin).name === 'terser');

  if (foundIndex > -1) {
    options.plugins![foundIndex] = minify;
  } else {
    if (!Array.isArray(options.plugins)) {
      options.plugins = [];
    }

    options.plugins.push(minify);
  }

  options.plugins!.push(filesize());

  return options;
}

module.exports = getRollupOptions;
