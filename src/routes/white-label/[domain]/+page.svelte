<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';
	import Header from './header.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Header />
<WhiteLabelPage
	name={data?.name}
	logo={data?.logo}
	title={m.lucky_warm_mayfly_engage()}
	lead={m.aloof_quaint_snail_pave()}
>
	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} hideUsps />
	</div>
</WhiteLabelPage>
