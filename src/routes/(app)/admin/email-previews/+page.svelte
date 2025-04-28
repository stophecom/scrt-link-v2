<script lang="ts">
	import PreviewInterface from 'svelte-email-tailwind/preview/PreviewInterface.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PreviewInterface data={data.previewData} email="info@scrt.link" />
