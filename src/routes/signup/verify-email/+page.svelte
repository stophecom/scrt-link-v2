<script lang="ts">
	import CodeForm from '$lib/components/forms/code-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page
	title={m.teary_soft_sparrow_believe()}
	lead={m.proud_key_toad_promise({ emailAddress: data.verificationForm.data.email })}
>
	<Section>
		<CodeForm verificationFormData={data.verificationForm} resendFormData={data.resendForm} />
	</Section>
</Page>
