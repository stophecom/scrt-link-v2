import { firefoxSend } from './firefox-send';
import { onetimesecret } from './onetimesecret';
import { passwordPusher } from './password-pusher';
import { privatebin } from './privatebin';
import { privnote } from './privnote';
import { tresoritSend } from './tresorit-send';
import type { Comparison, ComparisonCategory } from './types';
import { wetransfer } from './wetransfer';
import { wormhole } from './wormhole';
import { yopass } from './yopass';

export type { Comparison, ComparisonCategory, FeatureRow, FeatureValue } from './types';

const comparisons: Comparison[] = [
	onetimesecret,
	privnote,
	yopass,
	privatebin,
	passwordPusher,
	wetransfer,
	firefoxSend,
	wormhole,
	tresoritSend
];

export const getComparisons = () =>
	comparisons
		.filter((comparison) => comparison.published)
		.sort((a, b) => a.name.localeCompare(b.name));

export const getComparison = (slug: string) =>
	getComparisons().find((comparison) => comparison.slug === slug);

export const getComparisonsByCategory = (category: ComparisonCategory) =>
	getComparisons().filter((comparison) => comparison.category === category);
