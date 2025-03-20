import type { AvailablegetLocale } from '$lib/paraglide/runtime';

// Keep in sync with project.inlang/settings.json
const map: Record<AvailablegetLocale, string> = {
	de: 'Deutsch',
	en: 'English',
	fr: 'Français',
	es: 'Español',
	ru: 'Русский',
	cn: '中文(简体)'
};

export const getSupportedLanguagesMap = (locale: AvailablegetLocale) => {
	return map[locale];
};
