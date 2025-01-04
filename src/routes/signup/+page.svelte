<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.tough_jumpy_anteater_taste()} lead={m.teary_brief_robin_scoop()}>
	<Section>
		<EmailForm data={data.form} />
	</Section>
</Page>
