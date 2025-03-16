<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';
	import { SecretType } from '$lib/data/enums';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={'Neogram'} lead={m.white_tame_clownfish_scoop()}>
	<CreateSecret
		form={data.secretForm}
		user={data.user}
		baseUrl={data.baseUrl}
		secretType={SecretType.NEOGRAM}
	/>
</Page>
