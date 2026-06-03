import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter:
			process.env.ADAPTER === 'node'
				? (await import('@sveltejs/adapter-node')).default()
				: (await import('@sveltejs/adapter-vercel')).default(),

		csrf: { checkOrigin: process.env.CSRF_CHECK_ORIGIN === 'false' ? false : true }, // For debug purposes only

		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['none'],
				'script-src': ['self', 'https://js.stripe.com', 'https://vercel.live'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': [
					'self',
					'data:',
					'blob:',
					'https://*.os.zrh1.flow.swiss',
					'https://scrt-link.imgix.net',
					'https://lh3.googleusercontent.com'
				],
				'media-src': ['self'],
				'connect-src': ['self', 'data:', 'https://*.os.zrh1.flow.swiss', 'https://plausible.io'],
				'frame-src': ['self', 'https://js.stripe.com', 'https://vercel.live'],
				'worker-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'frame-ancestors': ['none'],
				'form-action': ['self'],
				'manifest-src': ['self']
			}
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
