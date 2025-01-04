<script lang="ts">
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import { superForm } from 'sveltekit-superforms';

	import CodeForm from '$lib/components/forms/code-form.svelte';
	import Page from '$lib/components/layout/page.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { message: resendMessage } = superForm(data.resendForm);
</script>

<Page
	title={m.teary_soft_sparrow_believe()}
	lead={m.proud_key_toad_promise({ emailAddress: data.verificationForm.data.email })}
>
	<div class="container justify-center">
		<div class="max-w-lg rounded border bg-slate-100 p-3 dark:bg-slate-900">
			{#if $resendMessage}
				<div class="py-3">
					<Alert.Root>
						<CircleCheck class="h-4 w-4" />
						<Alert.Title>{$resendMessage.title}</Alert.Title>
						<Alert.Description>{$resendMessage.description}</Alert.Description>
					</Alert.Root>
				</div>
			{/if}
			<CodeForm data={data.verificationForm} />
		</div>
		<form method="POST" action="?/resend">
			<input type="hidden" name="email" value={data.resendForm.data.email} />
			<div class="py-4">
				<Button type="submit" size="lg">Send code again</Button>
			</div>
		</form>
	</div>
</Page>
