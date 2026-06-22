<script lang="ts">
	import {
		CheckCircle2,
		ChevronDown,
		ChevronLeft,
		ChevronUp,
		CircleAlert,
		SparklesIcon,
		SquareArrowUpRight
	} from '@lucide/svelte';
	import { mode } from 'mode-watcher';
	import { useDebounce } from 'runed';
	import { tick } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import DarkModeSwitcher from '$lib/components/blocks/dark-mode-switcher.svelte';
	import PageLead from '$lib/components/blocks/page-lead.svelte';
	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import Color from '$lib/components/forms/form-fields/color.svelte';
	import FileUpload from '$lib/components/forms/form-fields/file-upload.svelte';
	import Switch from '$lib/components/forms/form-fields/switch.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Container } from '$lib/components/ui/container';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import Markdown from '$lib/components/ui/markdown';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { whiteLabelPublishSchema, whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let showSuccess = $state(false);
	let showSpinner = $state(false);
	let showAdvancedColors = $state(false);

	const submitDebounced = useDebounce(() => {
		submit();
	}, 1000);

	const form = superForm(data.whiteLabelSiteForm, {
		validators: zod4Client(whiteLabelSiteSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',

		onChange() {
			submitDebounced();
		},
		onUpdated() {
			if (typeof document !== 'undefined') {
				const iframe = document.getElementById('iframe-preview') as HTMLIFrameElement;
				if (iframe) iframe.src += '';
			}
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

	// Publishing is a separate, plan-gated form. Drafting above is always free.
	const publishForm = superForm(data.publishForm, {
		validators: zod4Client(whiteLabelPublishSchema()),
		invalidateAll: 'force'
	});
	const { form: publishData, enhance: enhancePublish, submit: submitPublish } = publishForm;

	$effect(() => {
		if ($message) {
			showSpinner = true;

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

<!-- Header (outside the content form so publishing is its own gated form) -->
<div class="h-16">
	<div
		class="bg-background border-border fixed top-0 left-0 z-10 h-16 w-full border-b shadow-[0_0_10px_0_rgba(0,0,0,0.05)]"
	>
		<Container variant="wide" class="flex h-full items-center justify-between">
			<Button href={localizeHref('/account/white-label')} variant="ghost" class="ps-2">
				<ChevronLeft class="me-2 h-5 w-5" />
				{m.solid_clean_insect_stir()}
			</Button>

			<div class="ms-auto flex items-center">
				{#if data.canPublish}
					<form method="POST" use:enhancePublish action="?/setWhiteLabelPublished">
						<Form.Field form={publishForm} name="published" class="py-4">
							<Switch
								bind:checked={$publishData.published}
								label={m.shy_sharp_seahorse_catch()}
								onCheckedChange={async () => {
									await tick();
									submitPublish();
								}}
							/>
						</Form.Field>
					</form>
				{:else}
					<Button
						variant="outline"
						size="sm"
						href={localizeHref('/pricing') + '?tab=business'}
						title={m.white_label_publish_locked_hint()}
					>
						<SparklesIcon class="me-2 h-4 w-4" />
						{m.teaser_white_label_cta()}
					</Button>
				{/if}

				<div class="flex min-w-8 justify-center">
					{#if $delayed}
						<Spinner class="h-5 w-5" />
					{/if}

					{#if showSuccess}
						<div in:scale={{ easing: elasticOut, duration: 1000 }}>
							{#if $message?.status === 'success'}
								<CheckCircle2 class="text-success h-6 w-6" />
							{/if}
							{#if $message?.status === 'error'}
								<CircleAlert class="text-destructive h-6 w-6" />
							{/if}
						</div>
					{/if}
				</div>

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
		</Container>
	</div>
</div>

<form method="POST" use:enhanceWhiteLabel action="?/saveWhiteLabelSite">
	<Container variant="wide" class=" grid items-start gap-12 pt-8 pb-16 md:grid-cols-[1fr_360px]">
		<!-- Left -->
		<div class="pt-16">
			<PageTitle title={m.misty_low_mantis_hug()}></PageTitle>
			<PageLead lead={m.brave_ok_hound_kiss()}></PageLead>

			{#if $message && $message.status === 'error'}
				<div class="py-3">
					<Alert title={$message.title} variant="destructive">
						{$message.description}
					</Alert>
				</div>
			{/if}

			<Card
				class="mb-6"
				title={m.fair_sad_parakeet_jest()}
				description={m.smart_direct_penguin_trust()}
			>
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="logo">
						<FileUpload
							class="h-24 max-w-22"
							label={m.fair_sad_parakeet_jest()}
							bind:value={$formData.logo}
							labelButton={m.ago_crisp_kangaroo_grasp()}
							labelDropzone={m.jolly_formal_tapir_gleam()}
						/>
					</Form.Field>
					<Form.Field {form} name="logoDarkMode">
						<FileUpload
							class="h-24 max-w-22"
							label="{m.fair_sad_parakeet_jest()} {m.lofty_plain_cod_learn()}"
							bind:value={$formData.logoDarkMode}
							labelButton={m.ago_crisp_kangaroo_grasp()}
							labelDropzone={m.jolly_formal_tapir_gleam()}
						/>
					</Form.Field>
				</div>
			</Card>

			<Card class="mb-6" title={m.shy_smug_crow_sing()} description={m.strong_strong_swan_hurl()}>
				<div class="grid grid-cols-4 gap-4">
					{#if mode.current === 'dark'}
						<Form.Field {form} name="darkPrimary">
							<Color label={m.white_label_theme_primary()} bind:value={$formData.darkPrimary} />
						</Form.Field>
						{#if showAdvancedColors}
							<Form.Field {form} name="darkBackground">
								<Color
									label={m.white_label_theme_background()}
									bind:value={$formData.darkBackground}
								/>
							</Form.Field>
							<Form.Field {form} name="darkForeground">
								<Color
									label={m.white_label_theme_foreground()}
									bind:value={$formData.darkForeground}
								/>
							</Form.Field>
							<Form.Field {form} name="darkCard">
								<Color label={m.white_label_theme_card()} bind:value={$formData.darkCard} />
							</Form.Field>
							<Form.Field {form} name="darkDestructive">
								<Color
									label={m.white_label_theme_destructive()}
									bind:value={$formData.darkDestructive}
								/>
							</Form.Field>
							<Form.Field {form} name="darkSuccess">
								<Color label={m.white_label_theme_success()} bind:value={$formData.darkSuccess} />
							</Form.Field>
							<Form.Field {form} name="darkInfo">
								<Color label={m.white_label_theme_info()} bind:value={$formData.darkInfo} />
							</Form.Field>
						{/if}
					{:else}
						<Form.Field {form} name="lightPrimary">
							<Color label={m.white_label_theme_primary()} bind:value={$formData.lightPrimary} />
						</Form.Field>
						{#if showAdvancedColors}
							<Form.Field {form} name="lightBackground">
								<Color
									label={m.white_label_theme_background()}
									bind:value={$formData.lightBackground}
								/>
							</Form.Field>
							<Form.Field {form} name="lightForeground">
								<Color
									label={m.white_label_theme_foreground()}
									bind:value={$formData.lightForeground}
								/>
							</Form.Field>
							<Form.Field {form} name="lightCard">
								<Color label={m.white_label_theme_card()} bind:value={$formData.lightCard} />
							</Form.Field>

							<Form.Field {form} name="lightDestructive">
								<Color
									label={m.white_label_theme_destructive()}
									bind:value={$formData.lightDestructive}
								/>
							</Form.Field>
							<Form.Field {form} name="lightSuccess">
								<Color label={m.white_label_theme_success()} bind:value={$formData.lightSuccess} />
							</Form.Field>
							<Form.Field {form} name="lightInfo">
								<Color label={m.white_label_theme_info()} bind:value={$formData.lightInfo} />
							</Form.Field>
						{/if}
					{/if}
				</div>

				<div class="mt-3 flex items-center gap-2">
					<Toggle variant="outline" size="sm" bind:pressed={showAdvancedColors}>
						{showAdvancedColors
							? m.white_label_theme_less_colors()
							: m.white_label_theme_advanced_colors()}
						<ChevronDown class="ml-2 h-4 w-4 {showAdvancedColors ? 'rotate-180' : ''}" />
					</Toggle>
					<Button type="submit" formaction="?/resetWhiteLabelTheme" variant="outline" size="sm">
						{m.white_label_theme_reset()}
					</Button>
				</div>

				<Separator class="my-4" />
				<div class="flex items-center gap-3">
					<span class="text-sm font-medium">{m.hour_lofty_warthog_wish()}</span>
					<DarkModeSwitcher />
				</div>
			</Card>

			<Card
				class="mb-6"
				title={m.honest_direct_tiger_surge()}
				description={m.zany_wide_cheetah_pause()}
			>
				<Form.Field {form} name="title">
					<Text
						bind:value={$formData.title}
						label={m.lower_inner_dog_bubble()}
						placeholder={m.lucky_warm_mayfly_engage()}
						{...$constraints.title}
					/>
				</Form.Field>

				<Form.Field {form} name="lead">
					<Text
						bind:value={$formData.lead}
						label={m.nimble_away_marmot_nurture()}
						placeholder={m.bland_spicy_penguin_fade()}
						{...$constraints.lead}
					/>
				</Form.Field>

				<Form.Field {form} name="description">
					<Textarea
						bind:value={$formData.description}
						label={m.caring_topical_ray_commend()}
						placeholder="Markdown"
						{...$constraints.description}
					/>
					<Form.Description>
						<Markdown
							markdown={m.true_mushy_ray_treat({
								markdown: '[markdown](https://www.markdownguide.org/basic-syntax/)'
							})}
						/>
					</Form.Description>
				</Form.Field>

				<Separator class="my-4" />
				<LanguageSwitcher showDropdownIndicator />
			</Card>

			<Card
				class="mb-6"
				title={m.witty_main_marlin_twirl()}
				description={m.bald_nimble_kitten_skip()}
			>
				<div class="grid gap-4 sm:grid-cols-[40%_1fr]">
					<Form.Field {form} name="appIcon">
						<FileUpload
							class="aspect-square h-24 max-w-24 rounded-lg object-cover"
							label={m.caring_jumpy_sloth_hunt()}
							description={m.keen_stock_ladybug_forgive()}
							bind:value={$formData.appIcon}
							labelButton={m.wide_tense_fireant_ask()}
							labelDropzone={m.lofty_cute_stork_loop()}
						/>
					</Form.Field>

					<Form.Field {form} name="ogImage">
						<FileUpload
							class="aspect-[1200/630] h-24 max-w-52 rounded object-cover"
							label={m.main_day_ant_propel()}
							description={m.whole_watery_finch_conquer()}
							bind:value={$formData.ogImage}
							labelButton={m.basic_tense_moose_twirl()}
							labelDropzone={m.born_glad_fly_list()}
						/>
					</Form.Field>
				</div>
			</Card>
		</div>

		<!-- Right -->
		<div class="top-0 max-sm:hidden md:sticky md:pt-34">
			<h5 class="ms-4 mb-2 font-bold">{m.teal_white_mongoose_urge()}</h5>
			<div>
				{@render renderFrame()}
			</div>
		</div>
	</Container>
</form>

<Dialog.Root>
	<Dialog.Trigger
		class="bg-background border-border fixed bottom-0 left-0 flex h-16 w-full items-center justify-center border-t font-medium shadow-[0_0_10px_0_rgba(0,0,0,0.05)] sm:hidden"
		>{m.teal_white_mongoose_urge()} <ChevronUp class="ms-2 h-4 w-4" />
	</Dialog.Trigger>
	<Dialog.Content class="overflow-y-auto sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{m.teal_white_mongoose_urge()}</Dialog.Title>
		</Dialog.Header>

		{@render renderFrame()}
	</Dialog.Content>
</Dialog.Root>

{#snippet renderFrame()}
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
{/snippet}
