<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import SPage from '$lib/components/page/s-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.each_light_mare_bump()} lead={m.warm_clean_horse_seek()}>
	<Container>
		<SPage form={data.form} />
	</Container>
</Page>
