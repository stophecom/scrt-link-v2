<script lang="ts">
	import TOS from '$lib/assets/terms/TermsOfService.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page title={m.bad_white_baboon_zap()} lead={m.strong_left_lynx_absorb()} markNotTranslated={true}>
	<Markdown markdown={TOS} format />
</Page>
