<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleFormPage title={m.legal_weak_jay_bless()} description={m.ago_crazy_pelican_pray()}>
	<EmailForm data={data.emailForm} action="?/loginWithEmail" />
	<div class="px-5 text-center text-sm">No login yet? Ask your administrator.</div>
</SingleFormPage>
