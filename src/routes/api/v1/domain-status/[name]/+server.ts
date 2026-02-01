import { error, json } from '@sveltejs/kit';

import { getConfigResponse, getDomainResponse, getSubdomain } from '$lib/domains';
import { type DomainResponse } from '$lib/types';

import type { RequestEvent } from './$types';

export type DomainStatusResponse = {
	message: string;
	verified?: boolean;
	instructions?: DomainResponse['verification'];
};
export const GET = async ({ params, locals }: RequestEvent) => {
	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	const domain = params.name;

	try {
		const [domainJson, configJson] = await Promise.all([
			getDomainResponse(domain),
			getConfigResponse(domain)
		]);

		if (domainJson?.error?.code === 'not_found') {
			// Domain not found on Vercel project
			return json({ message: 'Domain not found' }, { status: 400 });
		}

		// Unknown error
		if (domainJson.error) {
			return json({ message: 'Unknown error' }, { status: 400 });
		}

		// If the domain is not verified or is misconfigured, we return DNS config
		if (!domainJson.verified || configJson.misconfigured) {
			// If the domain is already pointing to Vercel, but is used in another project,
			// we get verification instructions via TXT.
			const needsTxtVerification = domainJson?.verification?.find((x) => x.type === 'TXT');
			// If the provided domain is a subdomain, we use CNAME instructions.
			const needsCnameVerification = domainJson?.name !== domainJson.apexName;
			const subdomain = getSubdomain(domainJson.name, domainJson.apexName);

			const instructions = needsTxtVerification
				? domainJson.verification
				: needsCnameVerification
					? [
							{
								type: 'CNAME',
								domain: subdomain,
								value: 'cname.vercel-dns.com.',
								reason: ''
							}
						]
					: [
							{
								type: 'A',
								domain: '@',
								value: '76.76.21.21',
								reason: ''
							}
						];

			return json({ message: 'Pending Verification', verified: false, instructions });
		}

		return json({ message: 'Valid Configuration', verified: true });
	} catch (e) {
		console.error(e);
	}
};
