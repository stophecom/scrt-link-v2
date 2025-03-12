import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';

import { getBlogPosts } from '$lib/server/blog';
import type { BlogPostMeta } from '$lib/types.js';

import type { EntryGenerator } from './$types';

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

// To make sure all blog entries are included in sitemap
export const entries: EntryGenerator = async () => {
	const posts = await getBlogPosts();
	return posts.map((item) => ({ slug: item.slug }));
};

export const prerender = 'auto';
