<script lang="ts">
	import CodeForm from '$lib/components/forms/email-verification-code-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.orange_arable_sloth_cuddle()}>
	<Section>
		<CodeForm verificationFormData={data.verificationForm} resendFormData={data.resendForm} />
	</Section>
</Page>
