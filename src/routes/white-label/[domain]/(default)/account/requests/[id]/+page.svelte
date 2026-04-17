<script lang="ts">
	import RequestResponseViewer from '$lib/components/blocks/request-response-viewer.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RequestResponseViewer {data} />
