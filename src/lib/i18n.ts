import { redirect } from '@sveltejs/kit';
import prettyBytes from 'pretty-bytes';

import { getLocale, type Locale, localizeHref } from '$lib/paraglide/runtime';

export const DEFAULT_LOCALE = 'en';

export const formatBytes = (number: number) => prettyBytes(number, { locale: getLocale() });

export const formatCurrency = (
	amount: number,
	currency: string = 'usd',
	minimumFractionDigits: number = 2
) =>
	new Intl.NumberFormat(getLocale(), {
		style: 'currency',
		currency,
		signDisplay: 'never',
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits
	}).format(amount);

export const formatNumber = (amount: number) => new Intl.NumberFormat(getLocale()).format(amount);

export const getLocalizedUrl = (location: string, locale: string) => {
	return localizeHref(location, { locale });
};

type CustomRedirect = typeof redirect;
export const redirectLocalized: CustomRedirect = (status, location) => {
	const locale = getLocale();
	return redirect(status, getLocalizedUrl(location as string, locale));
};

export const getAbsoluteLocalizedUrl = (baseUrl: string, location: string, locale?: Locale) => {
	return `${baseUrl}${getLocalizedUrl(location, locale || getLocale())}`;
};

export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat(getLocale(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
