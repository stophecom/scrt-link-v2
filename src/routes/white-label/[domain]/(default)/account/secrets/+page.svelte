<script lang="ts">
	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import SecretsCard from '../../../../../(app)/(default)/account/secrets-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PageTitle title={m.free_nimble_whale_fry()} />

<SecretsCard secrets={data.secrets} secretForm={data.secretForm} user={data.user} />
