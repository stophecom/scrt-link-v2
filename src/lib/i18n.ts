import { redirect } from '@sveltejs/kit';
import prettyBytes from 'pretty-bytes';

import * as runtime from '$lib/paraglide/runtime';

const DEFAULT_LANGUAGE = 'en';

export const formatBytes = (number: number) => prettyBytes(number, { locale: runtime.getLocale() });

export const formatCurrency = (
	amount: number,
	currency: string = 'usd',
	minimumFractionDigits: number = 2
) =>
	new Intl.NumberFormat(runtime.getLocale(), {
		style: 'currency',
		currency,
		signDisplay: 'never',
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits
	}).format(amount);

export const formatNumber = (amount: number) =>
	new Intl.NumberFormat(runtime.getLocale()).format(amount);

export const getLocalizedUrl = (location: string | URL, locale: string) => {
	return locale === DEFAULT_LANGUAGE ? location : `/${locale}${location}`;
};

type CustomRedirect = typeof redirect;
export const redirectLocalized: CustomRedirect = (status, location) => {
	const locale = runtime.getLocale();
	return redirect(status, getLocalizedUrl(location, locale));
};

export const getAbsoluteLocalizedUrl = (baseUrl: string, location: string) => {
	const locale = runtime.getLocale();
	return `${baseUrl}${getLocalizedUrl(location, locale)}`;
};

export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat(runtime.getLocale(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
