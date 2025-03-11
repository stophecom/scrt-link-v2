<script lang="ts">
	import DeleteAccountForm from '$lib/components/forms/delete-account-form.svelte';
	import SingleFormPage from '$lib/components/page/single-form-page.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.orange_major_sheep_hush()} description={m.agent_heavy_canary_jump()}>
	<DeleteAccountForm form={data.accountDeletionForm} />
</SingleFormPage>
