import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

import { buildOptions } from './env';

import { transformLodash } from '../plugins/transformLodash';

export const rollupPlugins = () => {
  const babelPlugins = [];
  if (buildOptions.styledComponent) {
    babelPlugins.push('babel-plugin-styled-components');
  }
  babelPlugins.push(
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread'
  );
  const ans = [
    resolve({
      browser: true,
    }),
    commonjs(),
    esbuild({
      include: /\.[jt]sx?$/,
      minify: buildOptions.proMode,
      target: 'es2017',
      sourceMap: true,
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-typescript'],
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['>0.25%, not dead'],
            },
          },
        ],
      ],
      plugins: babelPlugins,
    }),
  ];
  if (buildOptions.transformLodash) {
    ans.push(transformLodash());
  }
  return ans;
};
