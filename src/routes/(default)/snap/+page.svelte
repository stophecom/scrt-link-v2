<script lang="ts">
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Snap" lead={m.misty_north_hedgehog_breathe()}>
	<CreateSecret {data} secretType={'snap'} />
</Page>
