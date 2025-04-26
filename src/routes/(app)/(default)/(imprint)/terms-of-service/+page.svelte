<script lang="ts">
	import TOS from '$lib/assets/terms/TermsOfService.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={m.bad_white_baboon_zap()} lead={m.strong_left_lynx_absorb()} markNotTranslated={true}>
	<Container>
		<Markdown markdown={TOS} format />
	</Container>
</Page>
