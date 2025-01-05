<script lang="ts">
	import PasswordForm from '$lib/components/forms/password-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.smug_fair_larva_pride()}>
	<Section>
		<PasswordForm form={data.form} />
	</Section>
</Page>
