import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'functions/log-view/index.ts',
  output: {
    file: 'functions/log-view/dist/bundle.js',
    format: 'cjs',
  },
  plugins: [resolve(), commonjs(), typescript()],
};
