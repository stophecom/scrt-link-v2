<script lang="ts">
	import { page } from '$app/state';
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={data.domain} lead={'todo'}>
	<div class="mb-12">
		{data.domain} <br />
		{data.baseUrl}<br />
		{page.url}<br />
		<CreateSecret form={data.secretForm} user={data.user} baseUrl={data.baseUrl} />
	</div>
</Page>
