<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<h2>{m.backToPlans()}</h2>
<p>{m.button_cancel()}</p>
<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('de')}>de</button>
	<button onclick={() => switchToLanguage('fr')}>fr</button>
	<button onclick={() => switchToLanguage('sr')}>sr</button>
</div>
