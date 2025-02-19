// import { api } from '$lib/api.js';
import type { BlogPost } from '$lib/types';

// export const prerender = true;

export async function load({ fetch }) {
	const response = await fetch('/api/v1/blog');

	const posts: BlogPost[] = await response.json();

	return { posts };
}
