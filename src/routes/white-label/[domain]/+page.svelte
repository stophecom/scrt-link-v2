<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage title={data?.title || 'Your title'} lead={data?.lead} logo={data?.logo}>
	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} />
	</div>
</WhiteLabelPage>
