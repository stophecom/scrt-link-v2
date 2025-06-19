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
	title={m.grassy_fine_puma_push()}
	lead={m.fun_knotty_penguin_clip()}
	metaDescription={m.wacky_jumpy_chicken_gaze()}
	metaKeywords={m.tiny_watery_panda_hike()}
>
	<Container>
		<CreateSecret form={data.secretForm} user={data.user} secretTypes={[SecretType.REDIRECT]} />
	</Container>
</Page>
