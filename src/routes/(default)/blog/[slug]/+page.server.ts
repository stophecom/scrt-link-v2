import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';

import type { BlogPostMeta } from '$lib/types.js';

export async function load({ params }) {
	try {
		const post = await import(`$lib/data/blog/${params.slug}.md`);

		return {
			content: render(post.default),
			meta: { ...post.metadata, slug: params.slug } as BlogPostMeta
		};
	} catch (e) {
		console.error(e);
		error(404, `Could not find ${params.slug}`);
	}
}
