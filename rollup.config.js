import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      "presets": ["es2015-rollup"]
    }),
    nodeResolve({
      jsnext: true
    })
  ],
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  sourcemap: true
};
