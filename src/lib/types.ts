export type BlogCategory = 'product' | 'tech' | 'privacy';

export type BlogPostMeta = {
	title: string;
	lead: string;
	slug: string;
	ogImage: string;
	description: string;
	date: string;
	categories: BlogCategory[];
	published: boolean;
};
