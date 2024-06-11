import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lambda/log-view/index.ts',
  output: {
    file: 'lambda/log-view/dist/bundle.js',
    format: 'cjs',
  },
  plugins: [resolve(), commonjs(), typescript()],
};
