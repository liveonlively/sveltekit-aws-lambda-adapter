import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
	{
		input: {
			index: 'src/handler.js',
		},
		output: {
			dir: 'files',
			format: 'cjs',
		},
		plugins: [nodeResolve(), commonjs(), json()],
		external: ['../app.js', ...require('module').builtinModules],
	},
];
