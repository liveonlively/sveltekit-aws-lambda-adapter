/**
 * Based on the official node and netlify adapters:
 *
 * https://github.com/sveltejs/kit/tree/master/packages/adapter-node
 * https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify
 *
 * Note, if you update this, run `pnpm run build` to update the cdk-adapter/files directory
 * and commit the changes.
 */

import { App } from '../app.js';
import { __fetch_polyfill } from '@sveltejs/kit/install-fetch';
__fetch_polyfill();

export function init(manifest) {
	const app = new App(manifest);

	/** @type {import('aws-lambda').APIGatewayProxyHandlerV2} */ return async (event) => {
		const { rawPath, rawQueryString, cookies, headers, body, isBase64Encoded } = event;
		console.log(event);

		if (cookies) {
			headers['cookie'] = cookies.join('; ');
		}

		const requestEncoding = /** @type {BufferEncoding | undefined} */ (headers['content-encoding']);
		const encoding = isBase64Encoded ? 'base64' : requestEncoding || 'utf-8';
		const rawBody = typeof body === 'string' ? Buffer.from(body, encoding) : body;

		const url =
			'https://' +
			event.requestContext.domainName +
			// TODO event.requestContext.domainName is the API Gateway domain... we don't seem to pass a custom Host through...
			rawPath +
			(rawQueryString ? '?' + rawQueryString : '');

		const renderProps = {
			method: event.requestContext.http.method,
			url,
			headers,
			rawBody,
		};
		console.log({ renderProps });
		const rendered = await app.render(renderProps);
		if (rendered) {
			const resp = {
				/** @type {{[k: string]: string}} */ headers: {},
				/** @type {string[]} */ cookies: [],
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
		console.log({ rendered });
		return {
			statusCode: 404,
			body: 'Not found.',
		};
	};
}
