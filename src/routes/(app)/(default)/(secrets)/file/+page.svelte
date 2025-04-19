<script lang="ts">
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Page from '$lib/components/page/page.svelte';
	import { SecretType } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.sad_zippy_squirrel_scoop()} lead={m.pretty_clear_pig_dare()}>
	<CreateSecret form={data.secretForm} user={data.user} secretType={SecretType.FILE} />
</Page>
