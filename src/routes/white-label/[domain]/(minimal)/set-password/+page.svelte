<script lang="ts">
	import PasswordForm from '$lib/components/forms/password-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.front_fun_husky_pray()} description={m.male_ornate_mantis_feel()}>
	<PasswordForm form={data.form} />
</SingleFormPage>
