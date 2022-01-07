import { Adapter } from '@sveltejs/kit';
// import { BuildOptions } from 'esbuild';

interface AdapterOptions {
	out?: string;
}

declare function plugin(options?: AdapterOptions): Adapter;
export = plugin;
