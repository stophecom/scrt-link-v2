import { createI18n } from '@inlang/paraglide-sveltekit';
import { redirect } from '@sveltejs/kit';
import prettyBytes from 'pretty-bytes';

import * as runtime from '$lib/paraglide/runtime';

const DEFAULT_LANGUAGE = 'en';

export const i18n = createI18n(runtime);

export const formatBytes = (number: number) =>
	prettyBytes(number, { locale: runtime.languageTag() });

export const formatCurrency = (
	amount: number,
	currency: string = 'usd',
	minimumFractionDigits: number = 2
) =>
	new Intl.NumberFormat(runtime.languageTag(), {
		style: 'currency',
		currency,
		signDisplay: 'never',
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits
	}).format(amount);

export const formatNumber = (amount: number) =>
	new Intl.NumberFormat(runtime.languageTag()).format(amount);

export const getLocalizedUrl = (location: string | URL, locale: string) => {
	return locale === DEFAULT_LANGUAGE ? location : `/${locale}${location}`;
};

type CustomRedirect = typeof redirect;
export const redirectLocalized: CustomRedirect = (status, location) => {
	const locale = runtime.languageTag();
	return redirect(status, getLocalizedUrl(location, locale));
};

export const getAbsoluteLocalizedUrl = (baseUrl: string, location: string) => {
	const locale = runtime.languageTag();
	return `${baseUrl}${getLocalizedUrl(location, locale)}`;
};

export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat(runtime.languageTag(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
