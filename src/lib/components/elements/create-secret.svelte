<script lang="ts">
	import Check from 'lucide-svelte/icons/circle-check-big';
	import Reply from 'lucide-svelte/icons/reply';
	import { fade } from 'svelte/transition';

	import { onNavigate } from '$app/navigation';
	import { copyText } from '$lib/client/utils';
	import SecretForm, { type SecretFormProps } from '$lib/components/forms/secret-form.svelte';
	import Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tabs from '$lib/components/ui/tabs';
	import { privacyUsps } from '$lib/data/app';
	import type { SecretType } from '$lib/data/enums';
	import { secretMenu } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../routes/$types';
	import { getSecretTypes } from '../../data/secretSettings';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Markdown from '../ui/markdown';
	import ShareButton from '../ui/share-button';
	import Usps from './usps.svelte';

	type Props = {
		form: SecretFormProps['form'];
		baseUrl: LayoutServerData['baseUrl'];
		user: LayoutServerData['user'];
		secretType?: SecretType;
		hideUsps?: boolean;
	};
	let { form, baseUrl, user, secretType, hideUsps = false }: Props = $props();

	let masterKey = $state('');
	let successMessage = $state('');
	let link: string = $derived(`${baseUrl}/s#${masterKey}`);

	onNavigate(() => {
		// Make sure we force a reset. This causes the SecretForm to mount again which is what we want.
		successMessage = '';
	});

	$effect(() => {
		if (successMessage) {
			copyText(link);
		}
	});
</script>

{#if successMessage}
	<div
		in:fade
		class="border-primary bg-card relative mb-2 flex min-h-[290px] w-full flex-col items-stretch rounded border px-4 py-6 shadow-lg md:p-8"
	>
		<Check class="text-primary absolute top-6 right-6 h-8 w-8 sm:top-8 sm:right-8" />
		<div>
			<h3 class="text-primary mb-7 text-2xl font-semibold sm:text-3xl">
				{m.fluffy_vivid_mare_flow()}
			</h3>
			<div class="shrink overflow-hidden pe-2">
				<div class="mb-2 truncate text-xl font-normal whitespace-pre">{link}</div>
				<div class="text-muted-foreground block text-sm">
					<Markdown markdown={successMessage} />
				</div>
			</div>
		</div>
		<div class="mt-auto flex items-center justify-end pt-6">
			<ShareButton class="mr-2 shrink-0" url={link} text={m.giant_home_dachshund_feast()} />
			<CopyButton class="shrink-0" text={link} />
		</div>
	</div>
	<Button onclick={() => (successMessage = '')} variant="ghost" size="sm"
		><Reply class="mr-2 h-4 w-4" />{m.trite_fun_starfish_ripple()}</Button
	>
{:else}
	<Card>
		{#if secretType}
			<SecretForm {form} {user} {secretType} bind:masterKey bind:successMessage />
		{:else}
			<Tabs.Root value="text" let:value>
				<Tabs.List>
					{#each getSecretTypes().slice(0, 4) as secretTypeItem}
						<Tabs.Trigger value={secretTypeItem.value}>{secretTypeItem.label}</Tabs.Trigger>
					{/each}

					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								class="h-10 rounded-sm text-base font-medium"
							>
								...
								<span class="sr-only">{m.zany_male_robin_pull()}</span></Button
							></DropdownMenu.Trigger
						>
						<DropdownMenu.Content class="w-56">
							{#each secretMenu().slice(4) as menuItem}
								<DropdownMenu.Item href={menuItem.href}>
									<menuItem.icon class="me-2 h-4 w-4" />{menuItem.label}</DropdownMenu.Item
								>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Tabs.List>
				<Tabs.Content {value}>
					<SecretForm
						{form}
						{user}
						secretType={value as SecretType}
						bind:masterKey
						bind:successMessage
					/>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</Card>
	{#if !hideUsps}
		<Usps items={privacyUsps()} />
	{/if}
{/if}
