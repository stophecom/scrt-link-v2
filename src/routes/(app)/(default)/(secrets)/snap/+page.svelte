<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { SecretType } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page
	title={m.awake_big_halibut_view()}
	lead={m.misty_north_hedgehog_breathe()}
	metaDescription={m.tired_equal_meerkat_lead()}
	metaKeywords={m.spry_few_horse_drum()}
>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretTypes={[SecretType.SNAP]} />
	</Container>
</Page>
