import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: false,
	bundle: true,
	noExternal: [/@scrt-link\/.*/],
	banner: { js: '#!/usr/bin/env node' }
});
