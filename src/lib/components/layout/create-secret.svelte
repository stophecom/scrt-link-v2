<script lang="ts">
	import Check from 'lucide-svelte/icons/circle-check-big';
	import Reply from 'lucide-svelte/icons/reply';
	import Share from 'lucide-svelte/icons/share-2';
	import { fade } from 'svelte/transition';

	import SecretForm, {
		type SecretFormProps,
		type SecretType
	} from '$lib/components/forms/secret-form.svelte';
	import Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import Usps from '$lib/components/ui/usps';
	import { getSecretTypes } from '$lib/data/secretSettings';
	import { privacyUsps } from '$lib/data/usps';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../routes/$types';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Markdown from '../ui/markdown';

	type Props = {
		data: { form: SecretFormProps['form'] } & LayoutServerData;
		secretType?: SecretFormProps['secretType'];
	};
	let { data, secretType }: Props = $props();

	let masterPassword = $state('');
	let successMessage = $state('');
	let link: string = $derived(`${data.baseUrl}/s#${masterPassword}`);

	const webShare = async (link: string) => {
		const shareData = {
			title: 'scrt.link',
			text: m.giant_home_dachshund_feast(),
			url: link
		};
		await navigator.share(shareData);
	};
</script>

{#if successMessage}
	<div
		in:fade
		class="relative mb-2 flex min-h-[290px] w-full flex-col items-stretch rounded border border-primary bg-card px-4 py-6 shadow-lg md:p-8"
	>
		<Check class="absolute right-6 top-6 h-8 w-8 text-primary sm:right-8 sm:top-8" />
		<div>
			<h3 class="mb-7 text-2xl font-semibold text-primary sm:text-3xl">
				{m.fluffy_vivid_mare_flow()}
			</h3>
			<div class="flex-shrink overflow-hidden pe-2">
				<div class="mb-2 truncate whitespace-pre text-xl font-normal">{link}</div>
				<div class="block text-sm text-muted-foreground">
					<Markdown markdown={successMessage} />
				</div>
			</div>
		</div>
		<div class="mt-auto flex items-center justify-end pt-6">
			<Button variant="ghost" class="mr-2 shrink-0" on:click={() => webShare(link)}
				><Share class="mr-2 h-4 w-4" />{m.careful_bald_frog_harbor()}</Button
			>
			<CopyButton class="shrink-0" text={link} />
		</div>
	</div>
	<Button on:click={() => window.location.reload()} variant="ghost" size="sm"
		><Reply class="mr-2 h-4 w-4" />{m.trite_fun_starfish_ripple()}</Button
	>
{:else}
	<Card>
		{#if secretType}
			<SecretForm
				form={data.form}
				user={data.user}
				{secretType}
				bind:masterPassword
				bind:successMessage
			/>
		{:else}
			<Tabs.Root value="text" let:value>
				{@const secretType = value as SecretType}
				<Tabs.List>
					{#each getSecretTypes() as secretTypeItem}
						<Tabs.Trigger value={secretTypeItem.value}>{secretTypeItem.label}</Tabs.Trigger>
					{/each}
				</Tabs.List>
				<Tabs.Content {value}>
					<SecretForm
						form={data.form}
						user={data.user}
						{secretType}
						bind:masterPassword
						bind:successMessage
					/>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</Card>
	<Usps items={privacyUsps} />
{/if}
