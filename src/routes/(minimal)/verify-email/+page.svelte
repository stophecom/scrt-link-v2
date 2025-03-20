<script lang="ts">
	import EmailVerificationCodeForm from '$lib/components/forms/email-verification-code-form.svelte';
	import SingleFormPage from '$lib/components/page/single-form-page.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage
	title={m.orange_arable_sloth_cuddle()}
	description={m.proud_key_toad_promise({ emailAddress: data.resendForm.data.email })}
>
	<EmailVerificationCodeForm
		verificationFormData={data.verificationForm}
		resendFormData={data.resendForm}
	/>
</SingleFormPage>
