<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { SecretType } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page
	title={m.heavy_such_turkey_cuddle()}
	lead={m.top_full_gopher_approve()}
	metaDescription={m.male_dizzy_wallaby_urge()}
	metaKeywords={m.same_wild_bat_hint()}
>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretTypes={[SecretType.FILE]} />
	</Container>
</Page>
