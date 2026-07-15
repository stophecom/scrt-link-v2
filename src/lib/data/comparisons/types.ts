export type ComparisonCategory = 'secret-sharing' | 'file-transfer';

// `true`/`false` render as icons, strings render as text (e.g. "Up to 30 days").
export type FeatureValue = boolean | string;

export type FeatureRow = {
	label: string;
	scrtLink: FeatureValue;
	competitor: FeatureValue;
};

export type Comparison = {
	slug: string;
	name: string;
	website: string;
	category: ComparisonCategory;
	title: string;
	lead: string;
	metaTitle: string;
	metaDescription: string;
	metaKeywords: string;
	summary: string;
	features: FeatureRow[];
	keyDifferences: { title: string; body: string }[];
	chooseScrtLink: string[];
	chooseCompetitor: string[];
	// Defaults to "Choose {name} if…". Override where that reads wrong — e.g. a
	// discontinued product, where the real alternative is a community fork.
	chooseCompetitorTitle?: string;
	faq: { heading: string; body: string }[];
	// Every claim on the page is a snapshot. Bump this whenever the facts are re-checked.
	lastVerified: string;
	published: boolean;
};
