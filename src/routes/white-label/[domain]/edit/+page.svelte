<script lang="ts">
	import { Pencil } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
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

	const setFocus = (el: string) => {
		const editableDiv = document.getElementById(el);
		editableDiv?.focus();
	};
</script>

{#snippet editIcon(id: string)}
	<button
		class="bg-background border-foreground absolute top-[50%] left-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed p-2"
		onclick={() => setFocus(id)}
	>
		<Pencil class="h-5 w-5" />
	</button>
{/snippet}

<div class="container min-h-screen pb-16">
	<div class="flex justify-end py-3">
		<DarkModeSwitcher hideLabel variant="ghost" size="icon" />
		<LanguageSwitcher />
	</div>

	<div class="relative mb-12 inline-flex">
		<div
			class="bg-background border-foreground inline-flex min-w-24 items-center justify-center border border-dashed px-12 py-6 text-xl"
		>
			logo
		</div>
		{@render editIcon('logo')}
	</div>

	<div class="relative">
		<h1
			id="title"
			contenteditable="true"
			bind:innerHTML={$formData.title}
			class="text-primary font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
		></h1>
		{@render editIcon('title')}
	</div>

	<div class="relative">
		<p
			id="lead"
			class="mb-10 text-2xl leading-snug text-pretty md:text-3xl"
			contenteditable="true"
			bind:innerHTML={$formData.lead}
		></p>
		{@render editIcon('lead')}
	</div>

	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} hideUsps />
	</div>

	<div class="bg-background border border-dashed p-4">
		<h3 class="mb-3 text-2xl">Edit theme</h3>
		<pre>{$message?.description}</pre>

		{#if Object.keys($errors).length !== 0}
			<pre class="text-destructive">{JSON.stringify($errors)}</pre>
		{/if}

		<form method="POST" use:enhance action="?/saveWhiteLabelSite">
			<input type="hidden" name="title" value={$formData.title} />
			<input type="hidden" name="lead" value={$formData.lead} />

			<Form.Field {form} name="primaryColor" class="flex items-center">
				<input
					id="themeColor"
					name="primaryColor"
					class="mr-3 h-10 w-10 cursor-pointer"
					bind:value={$formData.primaryColor}
					{...$constraints.primaryColor}
					type="color"
				/>
				<Label for="themeColor">Primary color</Label>
			</Form.Field>

			<Form.Button delayed={$delayed}>{m.caring_light_tiger_taste()}</Form.Button>
		</form>
	</div>
</div>
