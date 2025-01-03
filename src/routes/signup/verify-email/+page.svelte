<script lang="ts">
	import CodeForm from '$lib/components/forms/code-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import Page from '../../page.svelte';
	import type { ActionData } from '../$types';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Page
	title={m.teary_soft_sparrow_believe()}
	lead={m.proud_key_toad_promise({ emailAddress: data.form.data.email })}
>
	<div class="container justify-center">
		<div class="max-w-lg rounded border bg-slate-100 p-3 dark:bg-slate-900">
			<CodeForm data={data.form} />
		</div>
		<form method="POST" action="?/resend">
			<div class="py-4">
				<Button type="submit" size="lg">Send code again</Button>
			</div>
		</form>

		{#if form?.success}
			<p>Code sent. Check our email.</p>
		{/if}
	</div>
</Page>
