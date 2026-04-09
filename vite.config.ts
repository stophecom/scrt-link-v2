import { paraglideVitePlugin } from '@inlang/paraglide-js';
import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import svelteEmailTailwind from 'svelte-email-tailwind/vite';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vitest/config';

const config = {
	theme: {
		fontFamily: {
			sans: [
				'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
			]
		},
		extend: {
			colors: {
				border: '#e5e7eb',
				muted: '#5c5c5c',
				background: '#f5f5f5',
				foreground: '#2e2e38',
				primary: {
					DEFAULT: '#e60077',
					foreground: '#ffffff'
				}
			}
		}
	}
};
const httpsConfig = fs.existsSync('./wl.scrt.link-key.pem')
	? { key: fs.readFileSync('./wl.scrt.link-key.pem'), cert: fs.readFileSync('./wl.scrt.link.pem') }
	: undefined;

export default defineConfig({
	server: {
		host: true,
		allowedHosts: ['wl.scrt.link'], // To test multi-tenant setup. Add to /etc/hosts locally
		https: httpsConfig,
		fs: {
			allow: [
				// Search for the workspace root (where pnpm-workspace.yaml is)
				searchForWorkspaceRoot(process.cwd())
			]
		}
	},
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale']
			// disableAsyncLocalStorage: true // Only Vercel
		}),
		sveltekit(),
		svelteEmailTailwind({ tailwindConfig: config }),
		svg(),
		tailwindcss()
	]
});
