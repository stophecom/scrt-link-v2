<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { SecretType } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.grassy_fine_puma_push()} lead={m.fun_knotty_penguin_clip()}>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretType={SecretType.REDIRECT} />
	</Container>
</Page>
