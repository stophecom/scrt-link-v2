<script lang="ts">
	import { CheckCircle2, ChevronLeft, SquareArrowUpRight } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import AndroidFrame from '$lib/components/elements/android-frame.svelte';
	import Color from '$lib/components/forms/form-fields/color.svelte';
	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
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
		<div class="mx-auto flex h-full items-center justify-between px-4 md:max-w-[1000px]">
			<Button href={localizeHref('/account')} variant="ghost">
				<ChevronLeft class="me-2 h-5 w-5" />
				{m.solid_clean_insect_stir()}
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

<div class="mx-auto grid items-start px-4 pt-8 pb-16 md:max-w-[1000px] md:grid-cols-[1fr_460px]">
	<div>
		<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite" onchange={submit}>
			<Form.Field {form} name="logo">
				<FileUpload
					class="h-24 max-w-22"
					label="Logo"
					bind:value={$formData.logo}
					labelButton={m.ago_crisp_kangaroo_grasp()}
					labelDropzone={m.jolly_formal_tapir_gleam()}
				/>
			</Form.Field>

			<div class="bg-muted my-4 rounded-sm p-4">
				<div class="mb-4 flex justify-end">
					<LanguageSwitcher showDropdownIndicator />
				</div>
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
			</div>

			<Form.Field {form} name="primaryColor">
				<Color
					label={m.last_wild_mongoose_heart()}
					bind:value={$formData.primaryColor}
					{...$constraints.primaryColor}
				/>
			</Form.Field>

			<div class="xs:grid-cols-[40%_1fr] grid gap-4">
				<Form.Field {form} name="appIcon">
					<FileUpload
						class="aspect-square h-24 max-w-24 rounded-lg object-cover"
						label="App Icon"
						description="App icon that is used for favicon. Recommended size: 180 x 180 pixels."
						bind:value={$formData.appIcon}
						labelButton={'Select app icon (square)'}
						labelDropzone={'Drop or select app icon (square)'}
					/>
				</Form.Field>

				<Form.Field {form} name="ogImage">
					<FileUpload
						class="aspect-[1200/630] h-24 max-w-52 rounded object-cover"
						label="Open Graph Image"
						description="Open graph image is used for link previews on social media. Recommended size: 1200 x 630 pixels."
						bind:value={$formData.ogImage}
						labelButton={'Select open graph image'}
						labelDropzone={'Drop or select open graph image'}
					/>
				</Form.Field>
			</div>
		</form>
	</div>

	<div class="sticky top-0 flex flex-col items-center justify-center pt-20">
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
