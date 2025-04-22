<script lang="ts">
	import { CheckCircle2, ChevronLeft, SquareArrowUpRight } from 'lucide-svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import AndroidFrame from '$lib/components/elements/android-frame.svelte';
	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Label from '$lib/components/ui/label/label.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showSuccess = $state(false);
	let showSpinner = $state(false);

	const form = superForm(data.whiteLabelSiteForm, {
		validators: zodClient(whiteLabelSiteSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',

		onSubmit() {
			console.log('submit', { $formData });

			showSpinner = true;
			setTimeout(() => {
				if (typeof document !== 'undefined') {
					const iframe = document.getElementById('iframe-preview') as HTMLIFrameElement;
					if (iframe) {
						iframe.src += '';
					}
				}
				showSpinner = false;
			}, 2000);
		},
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
		constraints,
		enhance: enhanceWhiteLabel,
		submit
	} = form;

	$effect(() => {
		if ($message) {
			showSuccess = true;

			setTimeout(() => {
				showSuccess = false;
			}, 2000);
		}
	});
</script>

<div class="h-16">
	<div class="bg-background border-border fixed top-0 left-0 z-10 h-16 w-full border-b">
		<div class="container flex h-full items-center justify-between">
			<Button href={localizeHref('/account')} variant="ghost">
				<ChevronLeft class="me-2 h-5 w-5" /> Account
			</Button>

			<div class="ms-auto flex items-center">
				{#if $delayed}
					<Spinner class="h-5 w-5" />
				{/if}

				<CheckCircle2
					class="text-success h-5 w-5 transition-opacity duration-1000 ease-in-out {showSuccess
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

<div class="mx-auto grid max-w-[1000px] grid-cols-[1fr_460px] px-4 pt-8 pb-16">
	<div>
		<div class="mb-4">
			<LanguageSwitcher showDropdownIndicator />
		</div>

		<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite" onchange={submit}>
			<Form.Field {form} name="logo">
				<FileUpload
					class="max-h-22 max-w-22"
					label="Logo"
					bind:value={$formData.logo}
					labelButton={m.ago_crisp_kangaroo_grasp()}
					labelDropzone={m.jolly_formal_tapir_gleam()}
				/>
			</Form.Field>

			<Form.Field {form} name="primaryColor" class="flex items-center">
				<input
					id="themeColor"
					name="primaryColor"
					class="mr-3 h-10 w-10 cursor-pointer"
					bind:value={$formData.primaryColor}
					{...$constraints.primaryColor}
					type="color"
				/><Label for="themeColor">Primary color</Label>
			</Form.Field>

			<Form.Field {form} name="title">
				<Text
					bind:value={$formData.title}
					label="Title"
					placeholder="Share a secret"
					{...$constraints.title}
				/>
			</Form.Field>

			<Form.Field {form} name="lead">
				<Text
					bind:value={$formData.lead}
					label="Lead"
					placeholder="with a secret..."
					{...$constraints.lead}
				/>
			</Form.Field>

			<Form.Field {form} name="description">
				<Textarea
					bind:value={$formData.description}
					label="Description"
					placeholder="Markdown"
					{...$constraints.description}
				/>
				<Form.Description>You can use markdown here.</Form.Description>
			</Form.Field>

			<Form.Field {form} name="appIcon">
				<FileUpload
					class="max-h-22 max-w-22"
					label="App Icon"
					description="App icon that is used for favicon. Minimum recommended size: 180x180px."
					bind:value={$formData.appIcon}
					labelButton={'Select app icon (square)'}
					labelDropzone={'Drop or select app icon (square)'}
				/>
			</Form.Field>

			<Form.Button delayed={$delayed} class="ml-auto">{m.caring_light_tiger_taste()}</Form.Button>
		</form>
	</div>

	<div class="flex flex-col items-center justify-center">
		<h5 class="mb-2 font-bold">Live Preview</h5>
		<AndroidFrame>
			<iframe
				id="iframe-preview"
				title="Preview"
				src={`/white-label/${data.domain}`}
				frameborder="0"
				width="100%"
				height="100%"
			></iframe>
			{#if $delayed || showSpinner}
				<div
					class="bg-background/50 absolute top-0 left-0 flex h-full w-full items-center justify-center"
				>
					<Spinner class="h-10 w-10" />
				</div>
			{/if}
		</AndroidFrame>
	</div>
</div>

<SuperDebug data={$formData} />
