<script lang="ts">
	import { CheckCircle2, ChevronLeft, Pencil, SquareArrowUpRight } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import PageLead from '$lib/components/page/page-lead.svelte';
	import PageTitle from '$lib/components/page/page-title.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
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

		onSubmit() {
			open = false;
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

	let open = $state(false);
</script>

<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
	<div class="h-16">
		<div class="bg-background border-border fixed top-0 left-0 z-10 h-16 w-full border-b">
			<div class="container flex h-full items-center justify-between">
				<Button href={localizeHref('/account')} variant="ghost">
					<ChevronLeft class="me-2 h-5 w-5" /> Account
				</Button>

				<Form.Field {form} name="primaryColor" class="flex items-center">
					<input
						id="themeColor"
						name="primaryColor"
						class="mr-3 h-10 w-10 cursor-pointer"
						bind:value={$formData.primaryColor}
						{...$constraints.primaryColor}
						onchange={() => submit()}
						type="color"
					/><Label class="sr-only" for="themeColor">Primary color</Label>
				</Form.Field>

				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
						><Pencil class="me-2 h-4 w-4" /> Edit Meta</Dialog.Trigger
					>

					<Dialog.Content class="sm:max-w-[600px]">
						<Dialog.Header>
							<Dialog.Title>Edit Meta</Dialog.Title>
						</Dialog.Header>

						<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
							<div class="mb-4 max-w-40">
								<FileUpload
									bind:fileKey={$formData.appIcon}
									labelButton={'Select app icon (square)'}
									labelDropzone={'Drop or select app icon (square)'}
								/>
							</div>
							<input type="hidden" name="appIcon" value={$formData.appIcon} />
							<Dialog.Footer>
								<Dialog.Close>
									<Form.Button delayed={$delayed} class="ml-auto"
										>{m.caring_light_tiger_taste()}</Form.Button
									>
								</Dialog.Close>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Root>

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

		<PageTitle
			style="--color-1: var(--color-primary) !important; --color-2: var(--color-primary) !important;"
			title={$formData.title || m.lucky_warm_mayfly_engage()}
		/>
		<PageLead renderAsHtml={!$formData.lead} lead={$formData.lead || m.aloof_quaint_snail_pave()} />

		<Card class="mb-12">
			<div class="bg-muted mb-4 h-9 w-1/2"></div>
			<div class="bg-background relative mb-4 h-28 w-full sm:h-32">
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

		<div class="bg-background mt-4 border border-dashed p-4 pt-2">
			<small class="text-muted-foreground mb-2">Description</small>
			<Markdown format={true} markdown={$formData.description || ''} />

			<pre>{$message?.description}</pre>

			{#if Object.keys($errors).length !== 0}
				<pre class="text-destructive">{JSON.stringify($errors)}</pre>
			{/if}

			<Dialog.Root bind:open>
				<Dialog.Trigger class="inline-block underline">{m.aloof_such_mare_dance()}</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[600px]">
					<Dialog.Header>
						<Dialog.Title>{m.spry_every_kangaroo_flip()}</Dialog.Title>
					</Dialog.Header>

					<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
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

						<Form.Button delayed={$delayed} class="ml-auto"
							>{m.caring_light_tiger_taste()}</Form.Button
						>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	<input type="hidden" name="logo" value={$formData.logo} />
	<input type="hidden" name="title" value={$formData.title} />
	<input type="hidden" name="lead" value={$formData.lead} />
	<input type="hidden" name="description" value={$formData.description} />
	<input type="hidden" name="imprint" value={$formData.imprint} />
	<input type="hidden" name="primaryColor" value={$formData.primaryColor} />
</form>
