<script lang="ts">
	// @ts-nocheck
	import Preview from 'svelte-email-tailwind/preview/preview.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Preview data={data.previewData} email="support@scrt.link" />
