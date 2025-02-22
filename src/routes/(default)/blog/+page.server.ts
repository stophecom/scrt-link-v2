import type { BlogPostMeta } from '$lib/types';

export async function load({ fetch }) {
	const response = await fetch('/api/v1/blog');

	const posts: BlogPostMeta[] = await response.json();

	return { posts };
}
