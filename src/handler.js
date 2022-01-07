/**
 * Based on the official node and netlify adapters:
 *
 * https://github.com/sveltejs/kit/tree/master/packages/adapter-node
 * https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify
 *
 * Note, if you update this, run `pnpm run build` to update the cdk-adapter/files directory
 * and commit the changes.
 */

import url from 'url';
import { App } from '../app.js';
import { __fetch_polyfill } from '@sveltejs/kit/install-fetch';
__fetch_polyfill();

export function init(manifest) {
	const app = new App(manifest);

	return async (event) => {
		const {
			rawPath: path,
			rawQueryString,
			headers,
			body,
			cookies: reqCookies,
			isBase64Encoded,
		} = event;

		if (reqCookies) {
			headers['cookie'] = reqCookies.join('; ');
		}

		const query = new url.URLSearchParams(rawQueryString);
		const encoding = isBase64Encoded ? 'base64' : headers['content-encoding'] || 'utf-8';
		const rawBody = typeof body === 'string' ? Buffer.from(body, encoding) : body;

		const rendered = await app.render({
			method: event.requestContext.http.method,
			headers,
			query,
			path,
			rawBody,
		});

		if (rendered) {
			const resp = {
				headers: {},
				cookies: [],
				body: rendered.body,
				statusCode: rendered.status,
			};
			Object.keys(rendered.headers).forEach((k) => {
				const v = rendered.headers[k];
				if (v instanceof Array) {
					if (k === 'set-cookie') {
						// @TODO Should really compare and add new cookies instead
						// of outright replacing them.
						resp.cookies = v;
					} else {
						// @TODO What to do with non-cookie multi-valued headers?
					}
				} else {
					resp.headers[k] = v;
				}
			});
			return resp;
		}
		return {
			statusCode: 404,
			body: 'Not found.',
		};
	};
}
