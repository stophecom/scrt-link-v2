export type BlogCategory = 'sveltekit' | 'svelte';

export type BlogPost = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: BlogCategory[];
	published: boolean;
};
