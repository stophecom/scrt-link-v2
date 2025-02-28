<script lang="ts">
	import DeleteAccountForm from '$lib/components/forms/delete-account-form.svelte';
	import SingleFormPage from '$lib/components/layout/page/single-form-page.svelte';

	// import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage
	title="Delete your account"
	description="If you close your account, all content will be deleted. If you have a subscription, it will be automatically canceled."
>
	<DeleteAccountForm form={data.accountDeletionForm} />
</SingleFormPage>
