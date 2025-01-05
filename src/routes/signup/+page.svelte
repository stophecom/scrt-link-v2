<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import SingleFormPage from '$lib/components/layout/single-form-page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.tough_jumpy_anteater_taste()} description={m.teary_brief_robin_scoop()}>
	<EmailForm data={data.form} />
</SingleFormPage>
