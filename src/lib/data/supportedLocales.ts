import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

const map: Record<AvailableLanguageTag, string> = {
	de: 'Deutsch',
	en: 'English',
	fr: 'Français'
};

export const getSupportedLanguagesMap = (locale: AvailableLanguageTag) => {
	return map[locale];
};
