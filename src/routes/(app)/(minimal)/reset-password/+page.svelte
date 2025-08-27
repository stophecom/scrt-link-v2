<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.spicy_tough_larva_cry()} description={m.smart_aware_albatross_animate()}>
	<EmailForm form={data.resetPasswordForm} formAction="?/resetPassword" />
</SingleFormPage>
