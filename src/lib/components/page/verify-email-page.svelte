<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	import EmailVerificationCodeForm from '$lib/components/forms/email-verification-code-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';
	import type {
		EmailFormSchema,
		EmailVerificationCodeFormSchema
	} from '$lib/validators/formSchemas';

	interface Props {
		verificationForm: SuperValidated<Infer<EmailVerificationCodeFormSchema>>;
		resendForm: SuperValidated<EmailFormSchema>;
	}

	let { verificationForm, resendForm }: Props = $props();
</script>

<SingleFormPage
	title={m.orange_arable_sloth_cuddle()}
	description={m.proud_key_toad_promise({ emailAddress: resendForm.data.email })}
>
	<EmailVerificationCodeForm verificationFormData={verificationForm} resendFormData={resendForm} />
</SingleFormPage>
