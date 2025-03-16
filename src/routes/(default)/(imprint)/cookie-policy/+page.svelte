<script lang="ts">
	import markdownDocument from '$lib/assets/terms/CookiePolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.lofty_lofty_beetle_revive()}
	lead={m.weary_crisp_newt_conquer()}
	markNotTranslated={true}
>
	<Markdown markdown={markdownDocument} format />
</Page>
