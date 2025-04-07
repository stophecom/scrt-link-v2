<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.whiteLabelSiteForm, {
		validators: zodClient(whiteLabelSiteSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',

		onSubmit() {},
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, delayed, errors, constraints, enhance } = form;
</script>

<div class="container min-h-screen pt-16 pb-16">
	<div
		class="border-foreground mb-12 inline-flex min-w-24 items-center justify-center border border-dashed px-12 py-6 text-xl"
	>
		logo
	</div>

	<h1
		contenteditable="true"
		bind:innerHTML={$formData.title}
		class="text-primary font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
	></h1>

	<p
		class="mb-10 text-2xl leading-snug text-pretty md:text-3xl"
		contenteditable="true"
		bind:innerHTML={$formData.lead}
	></p>

	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} hideUsps />
	</div>

	<pre>{$message?.description}</pre>
	<pre>{JSON.stringify($errors)}</pre>
	<form method="POST" use:enhance action="?/saveWhiteLabelSite">
		<input type="hidden" name="title" value={$formData.title} />
		<input type="hidden" name="lead" value={$formData.lead} />

		<Form.Field {form} name="primaryColor">
			<Label for="themeColor">Theme color</Label>
			<input
				id="themeColor"
				class="h-10 w-10 cursor-pointer"
				bind:value={$formData.primaryColor}
				{...$constraints.primaryColor}
				type="color"
			/>
		</Form.Field>

		<Form.Button delayed={$delayed}>{m.caring_light_tiger_taste()}</Form.Button>
	</form>
</div>
