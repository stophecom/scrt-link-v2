<script lang="ts">
	import { PUBLIC_IMGIX_CDN_URL } from '$env/static/public';
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';
	import Header from './header.svelte';

	let { data }: { data: PageData } = $props();

	const logo = data?.logo
		? `https://${PUBLIC_IMGIX_CDN_URL}/${data.logo}?auto=compress`
		: undefined;
</script>

<Header />
<WhiteLabelPage
	name={data?.name}
	{logo}
	title={data?.title || m.lucky_warm_mayfly_engage()}
	lead={data?.lead || m.aloof_quaint_snail_pave()}
>
	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} hideUsps />
	</div>

	{#if data?.description}
		<Markdown format={true} markdown={data.description} />
	{/if}
</WhiteLabelPage>
