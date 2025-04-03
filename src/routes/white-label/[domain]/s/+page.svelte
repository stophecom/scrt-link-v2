<script lang="ts">
	import SPage from '$lib/components/page/s-page.svelte';
	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage title={m.each_light_mare_bump()} lead={m.warm_clean_horse_seek()}>
	<SPage form={data.form} />
</WhiteLabelPage>
