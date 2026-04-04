<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import EmailForm from '$lib/components/forms/email-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';
	import type { EmailFormSchema } from '$lib/validators/formSchemas';

	interface Props {
		form: SuperValidated<EmailFormSchema>;
	}

	let { form }: Props = $props();
</script>

<SingleFormPage title={m.spicy_tough_larva_cry()} description={m.smart_aware_albatross_animate()}>
	<EmailForm {form} formAction="?/resetPassword" />
</SingleFormPage>
