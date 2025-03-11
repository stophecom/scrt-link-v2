<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import SingleFormPage from '$lib/components/page/single-form-page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.spicy_tough_larva_cry()} description={m.smart_aware_albatross_animate()}>
	<EmailForm data={data.resetPasswordForm} action="?/resetPassword" />
</SingleFormPage>
