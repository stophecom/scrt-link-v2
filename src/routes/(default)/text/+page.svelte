<script lang="ts">
	import SecretForm from '$lib/components/forms/secret-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Card from '$lib/components/ui/card';
	import Usps from '$lib/components/ui/usps';
	import { privacyUsps } from '$lib/data/usps';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.light_these_quail_sing()} lead={m.swift_small_gecko_drum()}>
	<Card>
		<SecretForm form={data.form} baseUrl={data.baseUrl} user={data.user} secretType={'text'} />
	</Card>
	<Usps items={privacyUsps} />
</Page>
