<script lang="ts">
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.grassy_fine_puma_push()} lead={m.fun_knotty_penguin_clip()}>
	<CreateSecret {data} secretType={'redirect'} />
</Page>
