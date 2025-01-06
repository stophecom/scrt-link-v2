<script lang="ts">
	import PasswordForm from '$lib/components/forms/password-form.svelte';
	import SingleFormPage from '$lib/components/layout/single-form-page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.front_fun_husky_pray()} description="Choose a strong password.">
	<PasswordForm form={data.form} />
</SingleFormPage>
