<script lang="ts">
	import EmailForm from '$lib/components/forms/email-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.tough_jumpy_anteater_taste()} lead={m.teary_brief_robin_scoop()}>
	<div class="container justify-center">
		<div class="max-w-lg rounded border bg-slate-100 p-3 dark:bg-slate-900">
			<Button variant="outline" href="/login/google">Sign in with Google</Button>
			<div class="py-5">
				<Separator />
			</div>
			<EmailForm data={data.form} />
		</div>
	</div>
</Page>
