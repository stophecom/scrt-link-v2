<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localizedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localizedPath);
	}
</script>

<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('de')}>de</button>
	<button onclick={() => switchToLanguage('fr')}>fr</button>
	<button onclick={() => switchToLanguage('sr')}>sr</button>
</div>
