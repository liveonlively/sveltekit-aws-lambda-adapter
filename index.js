import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import glob from 'tiny-glob/sync.js';
import esbuild from 'esbuild';
import path from 'path';

const files = fileURLToPath(new URL('./files', import.meta.url));

/** @type {import('.')} */
export default function ({ out = 'build' } = {}) {
	/** @type {import('@sveltejs/kit').Adapter} */
	return {
		name: 'lively-cdk-adapter',

		/** @param {import('@sveltejs/kit').Builder} builder */
		async adapt(builder) {
			builder.rimraf(out);

			builder.log.minor('Prerendering static pages');
			await builder.prerender({
				dest: `${out}/prerendered`,
			});

			builder.log.minor('Generating serverless functions...');

			// Outputs the SvelteKit server code
			const tempServerFolder = builder.getBuildDirectory('server');
			builder.writeServer(tempServerFolder);
			console.log(tempServerFolder);

			builder.log.minor('building lambda compatible nodejs code...');
			builder.mkdirp(`${out}/lambda/handler`);

			// Copy and transform each server file first
			builder.copy(tempServerFolder, `${out}/lambda/`);
			glob('**/*.js', { cwd: tempServerFolder }).forEach((file) => {
				const inputPath = `${tempServerFolder}/${file}`;
				const outputPath = `${out}/lambda/${file}`;
				const input = readFileSync(inputPath, 'utf8');
				const output = esbuild.transformSync(input, { format: 'cjs', target: 'node14' }).code;
				console.log('writing ', outputPath);
				builder.mkdirp(path.dirname(outputPath));
				writeFileSync(outputPath, output);
			});

			// Then build the entry points
			// TODO figure out how we could use the manifest to read the required files
			// and output them to a folder per function that we can then upload to aws lambda
			// and cut down on the size of the code in the folder
			esbuild.buildSync({
				entryPoints: [`${tempServerFolder}/app.js`, ...glob(`${tempServerFolder}/nodes/*.js`)],
				platform: 'node',
				format: 'cjs',
				target: 'node14',
				bundle: true,
				outdir: `${out}/lambda`,
			});
			builder.copy(`${files}`, `${out}/lambda/handler/`);

			/** @type {{ [k: string]: string }} */
			const routesToPaths = {};

			builder.log.minor('creating serverless functions per route...');
			builder.createEntries((route) => {
				const parts = [];

				for (const segment of route.segments) {
					if (segment.rest) {
						parts.push('{proxy+}');
						break; // I don't think aws gateway supports anything after an asterisk - like netlify
					} else if (segment.dynamic) {
						parts.push(`{${segment.content.slice(1, -1)}}`);
					} else {
						parts.push(segment.content);
					}
				}

				const pattern = `/${parts.join('/')}`;
				const name =
					parts
						.join('-')
						.replace(/[{}:.]/g, '_')
						.replace('*', '__rest') || 'index';

				return {
					id: pattern,
					filter: (other) => matches(route.segments, other.segments),
					complete: (entry) => {
						const manifest = entry.generateManifest({
							relativePath: '.',
							format: 'cjs',
						});
						const fn = `const { init } = require('./handler');\n\nexports.handler = init(${manifest});\n`;
						writeFileSync(`${out}/lambda/${name}.js`, fn);
						routesToPaths[pattern] = name;
					},
				};
			});
			writeFileSync(`${out}/lambda/routes.json`, JSON.stringify(routesToPaths, null, 2));
			writeFileSync(`${out}/lambda/package.json`, JSON.stringify({ type: 'commonjs' }));

			builder.log.minor('Copying assets...');
			builder.writeStatic(`${out}/static`);
			builder.writeClient(`${out}/client`);
			builder.copy(`${out}/client`, `${out}/lambda/`);
		},
	};
}

/**
 * @typedef {{ rest: boolean, dynamic: boolean, content: string }} RouteSegment
 */

/**
 * @param {RouteSegment[]} a
 * @param {RouteSegment[]} b
 * @returns {boolean}
 */
function matches(a, b) {
	if (a[0] && b[0]) {
		if (b[0].rest) {
			if (b.length === 1) return true;

			const next_b = b.slice(1);

			for (let i = 0; i < a.length; i += 1) {
				if (matches(a.slice(i), next_b)) return true;
			}

			return false;
		}

		if (!b[0].dynamic) {
			if (!a[0].dynamic && a[0].content !== b[0].content) return false;
		}

		if (a.length === 1 && b.length === 1) return true;
		return matches(a.slice(1), b.slice(1));
	} else if (a[0]) {
		return a.length === 1 && a[0].rest;
	} else {
		return b.length === 1 && b[0].rest;
	}
}
