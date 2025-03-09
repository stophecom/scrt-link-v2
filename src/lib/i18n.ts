import { createI18n } from '@inlang/paraglide-sveltekit';

import * as runtime from '$lib/paraglide/runtime';
export const i18n = createI18n(runtime);

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

export const getAbsoluteLocalizedUrl = (baseUrl: string, pathname: string, locale = 'en') =>
	`${baseUrl}${locale === defaultLanguage ? '' : `/${locale}`}${pathname}`;
