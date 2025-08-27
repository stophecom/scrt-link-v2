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
	title="Neogram"
	lead={m.white_tame_clownfish_scoop()}
	metaDescription={m.active_dirty_cheetah_roar()}
	metaKeywords={m.petty_ago_gibbon_enchant()}
>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretTypes={[SecretType.NEOGRAM]} />
	</Container>
</Page>
