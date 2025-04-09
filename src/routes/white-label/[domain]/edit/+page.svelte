<script lang="ts">
	import { CheckCircle2, Pencil, SquareArrowUpRight } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import Header from '../header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData; success: boolean } = $props();

	let success = $state(false);

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
	const submitForm = () => {
		form.submit();
	};

	$effect(() => {
		if ($message) {
			success = true;

			setTimeout(() => {
				success = false;
			}, 2000);
		}
	});
</script>

{#snippet editIcon(id: string)}
	<button
		class="bg-background border-foreground absolute top-[50%] right-0 -translate-y-1/2 rounded-full border border-dashed p-2"
		onclick={() => setFocus(id)}
	>
		<Pencil class="h-5 w-5" />
	</button>
{/snippet}

<Header class="bg-background border-border fixed top-0 left-0 z-10 w-full border-b">
	<div class="flex items-center">
		<Button class="min-w-0 shrink" variant="ghost" href={`https://${data.domain}`}>
			<span class="block truncate">{data.domain}</span>
			<SquareArrowUpRight class="ms-2 h-5 w-5" />
		</Button>
		{#if $delayed}
			<Spinner class="h-5 w-5" />
		{/if}

		<CheckCircle2
			class="text-success h-5 w-5 transition-opacity duration-1000 ease-in-out {success
				? 'opacity-100'
				: 'opacity-0'}"
		/>
	</div>
</Header>

<div class="container pt-28 pb-16">
	<div class="relative mb-12 inline-flex">
		<div
			class="bg-background border-foreground inline-flex min-w-24 items-center justify-center border border-dashed px-12 py-6 text-xl"
		>
			{m.novel_suave_pigeon_treasure()}
		</div>
		{@render editIcon('logo')}
	</div>

	<div class="relative">
		<h1
			id="title"
			contenteditable="true"
			bind:innerHTML={$formData.title}
			onblur={() => submitForm()}
			class="text-primary font-display mb-1 pe-6 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
		></h1>
		{@render editIcon('title')}
	</div>

	<div class="relative">
		<p
			id="lead"
			class="mb-10 pe-6 text-2xl leading-snug text-pretty md:text-3xl"
			contenteditable="true"
			onblur={() => submitForm()}
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
					onchange={() => submitForm()}
					type="color"
				/>
				<Label for="themeColor">Primary color</Label>
			</Form.Field>
		</form>
	</div>
</div>
