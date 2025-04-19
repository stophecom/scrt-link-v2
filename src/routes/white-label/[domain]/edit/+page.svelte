<script lang="ts">
	import { CheckCircle2, ChevronLeft, SquareArrowUpRight } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import PageLead from '$lib/components/page/page-lead.svelte';
	import PageTitle from '$lib/components/page/page-title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
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
		enhance: enhanceWhiteLabel
	} = form;

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

		// Track changes
		void $formData.logo;
		submitForm();
	});
</script>

<Header class="bg-background border-border fixed top-0 left-0 z-10 w-full border-b">
	<div class="flex items-center">
		<Button href={localizeHref('/account')} size="icon" variant="ghost">
			<ChevronLeft class=" h-5 w-5" />
		</Button>
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
	<div class="relative mb-12 inline-flex h-32 w-56">
		<FileUpload bind:fileUrl={$formData.logo} />
	</div>

	<PageTitle title={m.lucky_warm_mayfly_engage()} />
	<PageLead lead={m.aloof_quaint_snail_pave()} />

	<div class="relative mb-12">
		<CreateSecret form={data.secretForm} user={data.user} hideUsps />
		<div class="bg-background/70 absolute top-0 left-0 h-full w-full">
			<div
				class="text-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-5xl font-bold uppercase sm:text-7xl"
			>
				{m.fresh_tough_bullock_snap()}
			</div>
		</div>
	</div>

	<div class="bg-background border border-dashed p-4">
		<h3 class="mb-3 text-2xl">Edit theme</h3>
		<pre>{$message?.description}</pre>

		{#if Object.keys($errors).length !== 0}
			<pre class="text-destructive">{JSON.stringify($errors)}</pre>
		{/if}

		<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
			<input type="hidden" name="title" value={$formData.title} />
			<input type="hidden" name="lead" value={$formData.lead} />
			<input type="hidden" name="logo" value={$formData.logo} />

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
