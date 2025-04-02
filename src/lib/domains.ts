import { VERCEL_API_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID } from '$env/static/private';
import {
	type DomainConfigResponse,
	type DomainResponse,
	type DomainVerificationResponse
} from '$lib/types';

export const addDomainToVercel = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: domain
				// Optional: Redirect www. to root domain
				// ...(domain.startsWith("www.") && {
				//   redirect: domain.replace("www.", ""),
				// }),
			})
		}
	).then((res) => res.json());
};

export const removeDomainFromVercelProject = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`
			},
			method: 'DELETE'
		}
	).then((res) => res.json());
};

// @todo check if needed
export const removeDomainFromVercelTeam = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v6/domains/${domain}${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`
			},
			method: 'DELETE'
		}
	).then((res) => res.json());
};

export const getDomainResponse = async (
	domain: string
): Promise<DomainResponse & { error: { code: string; message: string } }> => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}
	).then((res) => {
		return res.json();
	});
};

export const getConfigResponse = async (domain: string): Promise<DomainConfigResponse> => {
	return await fetch(
		`https://api.vercel.com/v6/domains/${domain}/config${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}
	).then((res) => res.json());
};

export const verifyDomain = async (domain: string): Promise<DomainVerificationResponse> => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify${
			VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
		}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${VERCEL_API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}
	).then((res) => res.json());
};

export const getSubdomain = (name: string, apexName: string) => {
	if (name === apexName) return null;
	return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string) => {
	let domain;
	try {
		domain = new URL(url).hostname;
	} catch (e) {
		console.error(e);
		return '';
	}
	const parts = domain.split('.');
	if (parts.length > 2) {
		// if it's a subdomain (e.g. dub.vercel.app), return the last 2 parts
		return parts.slice(-2).join('.');
	}
	// if it's a normal domain (e.g. dub.sh), we return the domain
	return domain;
};

// courtesy of ChatGPT: https://sharegpt.com/c/pUYXtRs
export const validDomainRegex = new RegExp(
	/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
);
