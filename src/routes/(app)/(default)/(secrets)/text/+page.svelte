<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { SecretType } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page
	title={m.clear_equal_javelina_aid()}
	lead={m.male_every_llama_hack()}
	metaDescription={m.trite_mild_mayfly_devour()}
	metaKeywords={m.heroic_sad_bison_arrive()}
>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretTypes={[SecretType.TEXT]} />
	</Container>
</Page>
