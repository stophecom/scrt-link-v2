<script lang="ts">
	import SPage from '$lib/components/page/s-page.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SPage form={data.form} />
