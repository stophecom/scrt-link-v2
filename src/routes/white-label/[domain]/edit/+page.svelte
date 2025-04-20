<script lang="ts">
	import { CheckCircle2, ChevronLeft, SquareArrowUpRight } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import PageLead from '$lib/components/page/page-lead.svelte';
	import PageTitle from '$lib/components/page/page-title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import Header from '../header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

	const {
		form: formData,
		message,
		delayed,
		errors,
		constraints,
		enhance: enhanceWhiteLabel,
		submit
	} = form;

	let logoUrl = $derived($formData.logo);

	$effect(() => {
		if ($message) {
			success = true;

			setTimeout(() => {
				success = false;
			}, 2000);
		}

		// When logo changes, we submit form
		if (logoUrl || logoUrl === null) {
			submit();
		}
	});
</script>

<div class="h-16">
	<div class="bg-background border-border fixed top-0 left-0 z-10 h-16 w-full border-b">
		<div class="container flex h-full items-center justify-between">
			<Button href={localizeHref('/account')} size="icon" variant="ghost">
				<ChevronLeft class=" h-5 w-5" />
			</Button>

			<Form.Field {form} name="primaryColor" class="flex items-center">
				<Label class="inline-flex cursor-pointer items-center" for="themeColor">
					<input
						id="themeColor"
						name="primaryColor"
						class="mr-3 h-10 w-10 cursor-pointer"
						bind:value={$formData.primaryColor}
						{...$constraints.primaryColor}
						onchange={() => submit()}
						type="color"
					/>
					Primary color</Label
				>
			</Form.Field>

			<div class="ms-auto flex items-center">
				{#if $delayed}
					<Spinner class="h-5 w-5" />
				{/if}

				<CheckCircle2
					class="text-success h-5 w-5 transition-opacity duration-1000 ease-in-out {success
						? 'opacity-100'
						: 'opacity-0'}"
				/>
				<Button
					class="min-w-0 shrink"
					variant="ghost"
					href={`https://${data.domain}`}
					target="_blank"
				>
					<span class="block truncate">{data.domain}</span>
					<SquareArrowUpRight class="ms-2 h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>
</div>

<Header />

<div class="container pt-8 pb-16">
	<div class="relative mb-12 inline-flex h-32 w-56">
		<FileUpload
			bind:fileKey={$formData.logo}
			labelButton={m.ago_crisp_kangaroo_grasp()}
			labelDropzone={m.jolly_formal_tapir_gleam()}
		/>
	</div>

	<PageTitle title={m.lucky_warm_mayfly_engage()} />
	<PageLead lead={m.aloof_quaint_snail_pave()} />

	<Card class="mb-12">
		<div class="bg-muted mb-4 h-9 w-1/2"></div>
		<div class="bg-background relative mb-4 h-36 w-full sm:h-40">
			<div
				class="text-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 text-4xl font-bold uppercase sm:text-5xl"
			>
				{m.fresh_tough_bullock_snap()}
			</div>
		</div>

		<div class="flex justify-between">
			<div class="bg-muted h-12 w-1/3 sm:w-1/5"></div>
			<div class="bg-primary h-12 w-1/2 rounded-md sm:w-1/4"></div>
		</div>
	</Card>

	<Markdown format={true} markdown={$formData.imprint} />

	<div class="bg-background mt-4 border border-dashed p-4">
		<h3 class="mb-3 text-2xl">Edit theme</h3>
		<pre>{$message?.description}</pre>

		{#if Object.keys($errors).length !== 0}
			<pre class="text-destructive">{JSON.stringify($errors)}</pre>
		{/if}

		<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
			<input type="hidden" name="title" value={$formData.title} />
			<input type="hidden" name="lead" value={$formData.lead} />
			<input type="hidden" name="logo" value={$formData.logo} />
			<input type="hidden" name="primaryColor" value={$formData.primaryColor} />

			<Form.Field {form} name="imprint">
				<Textarea
					bind:value={$formData.imprint}
					label="Imprint"
					onchange={() => submit()}
					placeholder="Markdown"
					{...$constraints.imprint}
				/>
			</Form.Field>
		</form>
	</div>
</div>
