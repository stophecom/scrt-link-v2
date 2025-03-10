<script lang="ts">
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import { SecretType } from '$lib/data/enums';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Snap" lead={m.misty_north_hedgehog_breathe()}>
	<CreateSecret
		form={data.secretForm}
		user={data.user}
		baseUrl={data.baseUrl}
		secretType={SecretType.SNAP}
	/>
</Page>
