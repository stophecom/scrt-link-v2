import { createI18n } from '@inlang/paraglide-sveltekit';

import * as runtime from '$lib/paraglide/runtime';
export const i18n = createI18n(runtime);

import { redirect } from '@sveltejs/kit';
import prettyBytes from 'pretty-bytes';

const defaultLanguage = 'en';

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

export const getLocalizedUrl = (location: string | URL) => {
	const locale = runtime.languageTag();

	return `${locale === defaultLanguage ? '' : `/${locale}`}${location}`;
};

type CustomRedirect = typeof redirect;
export const redirectLocalized: CustomRedirect = (status, location) =>
	redirect(status, getLocalizedUrl(location));

export const getAbsoluteLocalizedUrl = (baseUrl: string, pathname: string, locale = 'en') =>
	`${baseUrl}${locale === defaultLanguage ? '' : `/${locale}`}${pathname}`;

export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat(runtime.languageTag(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
