import { getBlogPosts } from '$lib/server/blog';

export async function load() {
	const posts = await getBlogPosts();

	return { posts };
}
