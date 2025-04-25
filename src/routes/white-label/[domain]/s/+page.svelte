<script lang="ts">
	import { mode } from 'mode-watcher';

	import SPage from '$lib/components/page/s-page.svelte';
	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import Header from '../header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let logo = $derived(mode.current === 'dark' ? data.logoDarkMode : data.logo);
</script>

<Header />
<WhiteLabelPage
	name={data?.name}
	{logo}
	title={m.each_light_mare_bump()}
	lead={m.warm_clean_horse_seek()}
>
	<SPage form={data.form} />
</WhiteLabelPage>
