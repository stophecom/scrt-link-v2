import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

// Keep in sync with project.inlang/settings.json
const map: Record<AvailableLanguageTag, string> = {
	de: 'Deutsch',
	en: 'English',
	fr: 'Français',
	es: 'Español',
	ru: 'Русский'
};

export const getSupportedLanguagesMap = (locale: AvailableLanguageTag) => {
	return map[locale];
};
