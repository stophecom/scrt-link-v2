import type { Locale } from '$lib/paraglide/runtime';

// Keep in sync with project.inlang/settings.json
const map: Record<Locale, string> = {
	de: 'Deutsch',
	en: 'English',
	fr: 'Français',
	es: 'Español',
	pt: 'Português',
	ru: 'Русский',
	'zh-CN': '中文(简体)'
};

export const getSupportedLocales = () => {
	return Object.keys(map) as Locale[];
};

export const getSupportedLanguagesMap = (locale: Locale) => {
	return map[locale];
};
