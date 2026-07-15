import { error } from '@sveltejs/kit';

import { getComparison, getComparisons } from '$lib/data/comparisons';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const comparison = getComparison(params.slug);

	if (!comparison) {
		error(404, 'Comparison not found.');
	}

	return {
		comparison,
		otherComparisons: getComparisons().filter(({ slug }) => slug !== comparison.slug)
	};
};
