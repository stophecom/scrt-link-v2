<script lang="ts">
	import Check from '@lucide/svelte/icons/circle-check-big';
	import Reply from '@lucide/svelte/icons/reply';
	import { fade } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { copyText } from '$lib/client/utils';
	import SecretRequestForm from '$lib/components/forms/secret-request-form.svelte';
	import type { TierOptions } from '$lib/data/enums';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import type { SecretRequestFormSchema } from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	import Card from '../ui/card';
	import CopyButton from '../ui/copy-button';
	import Markdown from '../ui/markdown';
	import ShareButton from '../ui/share-button';

	type Props = {
		form: SuperValidated<SecretRequestFormSchema>;
		subscriptionTier?: TierOptions | null;
	};

	let { form, subscriptionTier }: Props = $props();

	let successMessage = $state('');
	let requestLink = $state('');

	let planLimits = $derived(getUserPlanLimits(subscriptionTier));

	$effect(() => {
		if (successMessage && requestLink) {
			copyText(requestLink);
		}
	});
</script>

{#if successMessage}
	<div
		in:fade
		class="border-primary bg-card relative mb-2 flex min-h-[290px] w-full flex-col items-stretch overflow-hidden rounded border px-4 py-6 shadow-lg md:p-8"
	>
		<Check class="text-primary absolute top-6 right-6 h-8 w-8 sm:top-8 sm:right-8" />
		<div>
			<h3 class="text-primary mb-7 text-2xl font-semibold sm:text-3xl">
				{m.proud_vivid_hawk_cheer()}
			</h3>
			<div class="min-w-0 shrink overflow-hidden pe-2">
				<div class="mb-2 truncate text-lg font-normal" data-testid="request-link">
					{requestLink}
				</div>
				<div class="text-muted-foreground block text-sm" data-testid="request-success-message">
					<Markdown markdown={successMessage} />
				</div>
			</div>
		</div>
		<div class="mt-auto flex items-center justify-end pt-6">
			<ShareButton class="mr-2 shrink-0" url={requestLink} text={m.warm_neat_dove_share()} />
			<CopyButton class="shrink-0" text={requestLink} />
		</div>
	</div>
	<Button onclick={() => (successMessage = '')} variant="ghost" size="sm">
		<Reply class="mr-2 h-4 w-4" />{m.trite_fun_starfish_ripple()}
	</Button>
{:else}
	<Card title={m.fresh_bold_eagle_build()}>
		<SecretRequestForm
			{form}
			expirationOptions={planLimits.expirationOptions}
			tier={subscriptionTier}
			bind:successMessage
			bind:requestLink
		/>
	</Card>
{/if}
