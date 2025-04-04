<script lang="ts">
	import SigninForm from '$lib/components/forms/signin-form.svelte';
	import SingleFormPage from '$lib/components/page/single-form-page.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.legal_weak_jay_bless()} description={m.ago_crazy_pelican_pray()}>
	<SigninForm data={data.passwordForm} />
</SingleFormPage>
