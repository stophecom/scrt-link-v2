import { json } from '@sveltejs/kit';

import type { BlogPost } from '$lib/types';

async function getPosts() {
	let posts: BlogPost[] = [];

	const paths = import.meta.glob('$lib/data/blog/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<BlogPost, 'slug'>;
			const post = { ...metadata, slug } satisfies BlogPost;
			if (post.published) {
				posts.push(post);
			}
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export const GET = async () => {
	const posts = await getPosts();
	return json(posts);
};
