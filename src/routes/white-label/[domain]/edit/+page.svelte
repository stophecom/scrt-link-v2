<script lang="ts">
	import { CheckCircle2, ChevronLeft, SquareArrowUpRight } from 'lucide-svelte';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import AndroidFrame from '$lib/components/elements/android-frame.svelte';
	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import Color from '$lib/components/forms/form-fields/color.svelte';
	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import PageLead from '$lib/components/page/page-lead.svelte';
	import PageTitle from '$lib/components/page/page-title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Form from '$lib/components/ui/form';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import Separator from '$lib/components/ui/separator/separator.svelte';
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
		constraints,
		enhance: enhanceWhiteLabel,
		submit
	} = form;

	$effect(() => {
		if ($message) {
			showSpinner = true;

			if (typeof document !== 'undefined') {
				const iframe = document.getElementById('iframe-preview') as HTMLIFrameElement;
				if (iframe) {
					iframe.src += '';
				}
			}

			setTimeout(() => {
				showSpinner = false;
				showSuccess = true;
			}, 800);

			setTimeout(() => {
				showSuccess = false;
			}, 2000);
		}
	});
</script>

<div class="h-16">
	<div class="bg-background border-border fixed top-0 left-0 z-10 h-16 w-full border-b">
		<div class="mx-auto flex h-full items-center justify-between px-4 md:max-w-[1100px]">
			<Button href={localizeHref('/account')} variant="ghost">
				<ChevronLeft class="me-2 h-5 w-5" />
				{m.solid_clean_insect_stir()}
			</Button>

			<div class="ms-auto flex items-center">
				{#if $delayed}
					<Spinner class="h-5 w-5" />
				{/if}

				{#if showSuccess}
					<div in:scale={{ easing: elasticOut, duration: 1000 }}>
						<CheckCircle2 class="text-success h-6 w-6" />
					</div>
				{/if}

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

<div
	class="mx-auto grid items-start gap-12 px-4 pt-8 pb-16 md:max-w-[1100px] md:grid-cols-[1fr_360px]"
>
	<div class="pt-16">
		<PageTitle title="Customize your website"></PageTitle>
		<PageLead lead="Make it yours: Customize the content of your secret sharing site."></PageLead>

		<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite" onchange={submit}>
			<Card
				class="mb-6"
				title="Logo"
				description="For best results, use a logo with a transparent background—preferably in SVG or PNG format."
			>
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="logo">
						<FileUpload
							class="h-24 max-w-22"
							label="Logo"
							bind:value={$formData.logo}
							labelButton={m.ago_crisp_kangaroo_grasp()}
							labelDropzone={m.jolly_formal_tapir_gleam()}
						/>
					</Form.Field>
					<Form.Field {form} name="logoDarkMode">
						<FileUpload
							class="h-24 max-w-22"
							label="Logo (dark mode)"
							bind:value={$formData.logoDarkMode}
							labelButton={m.ago_crisp_kangaroo_grasp()}
							labelDropzone={m.jolly_formal_tapir_gleam()}
						/>
					</Form.Field>
				</div>
				<Separator class="my-4" />
				<DarkModeSwitcher variant="outline" />
			</Card>

			<Card
				class="mb-6"
				title="Theme"
				description="Choose your brand color, ensuring it has good contrast for readability and accessibility."
			>
				<Form.Field {form} name="primaryColor">
					<Color
						label={m.last_wild_mongoose_heart()}
						bind:value={$formData.primaryColor}
						{...$constraints.primaryColor}
					/>
				</Form.Field>
			</Card>

			<Card
				class="mb-6"
				title="Custom texts"
				description="Create a personalized message for your audience. Be sure to include text in every language you wish to support."
			>
				<Form.Field {form} name="title">
					<Text
						bind:value={$formData.title}
						label="Title"
						placeholder={m.lucky_warm_mayfly_engage()}
						{...$constraints.title}
					/>
				</Form.Field>

				<Form.Field {form} name="lead">
					<Text
						bind:value={$formData.lead}
						label="Lead"
						placeholder={m.bland_spicy_penguin_fade()}
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

				<Separator class="my-4" />
				<LanguageSwitcher showDropdownIndicator />
			</Card>

			<Card
				class="mb-6"
				title="Meta images"
				description="Add an app icon to be used as a favicon, and an Open Graph image to enhance how your site appears when shared on social media."
			>
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
			</Card>
		</form>
	</div>

	<div class="sticky top-0 md:pt-34">
		<h5 class="ms-4 mb-2 font-bold">{m.teal_white_mongoose_urge()}</h5>
		<div>
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
</div>
