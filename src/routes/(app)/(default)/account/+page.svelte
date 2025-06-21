<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import LogOut from '@lucide/svelte/icons/log-out';

	import { enhance } from '$app/forms';
	import DarkModeSwitcher from '$lib/components/blocks/dark-mode-switcher.svelte';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Container from '$lib/components/ui/container/container.svelte';
	import CopyButton from '$lib/components/ui/copy-button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { whiteLabelDemoWebsite } from '$lib/data/app';
	import { Role, TierOptions } from '$lib/data/enums';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';
	import AccountCard from './account-card.svelte';
	import OrganizationCard from './organization-card.svelte';
	import SecretsCard from './secrets-card.svelte';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;

	const planLimits = getUserPlanLimits(user?.subscriptionTier);

	const isAdminFlag = $derived(user.role === Role.ADMIN);
</script>

<Page
	title={m.zany_jolly_cuckoo_scoop({
		name: data.userForm.data.name || m.quiet_long_beaver_scold()
	})}
	lead={m.gray_quiet_tern_bubble()}
>
	<Container>
		<Tabs.Root value="secrets">
			<Tabs.List class="mb-2">
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="secrets"
					>{m.free_nimble_whale_fry()}</Tabs.Trigger
				>
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="account"
					>{m.super_flaky_wallaby_pick()}</Tabs.Trigger
				>
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="api"
					>{m.super_funny_jackal_pause()}</Tabs.Trigger
				>
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="secretService"
					>{TierOptions.SECRET_SERVICE}</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="secrets">
				<SecretsCard secrets={data.secrets} secretForm={data.secretForm} user={data.user} />
			</Tabs.Content>
			<Tabs.Content value="account">
				{#if isAdminFlag}
					<Card class="mb-6" title="Admin">
						<Button variant="outline" class="me-2 mb-6" href={localizeHref('/admin')}
							>Admin Panel</Button
						>
						<Button variant="outline" class="mb-6" href={localizeHref('/admin/email-previews')}
							>Email Previews</Button
						>
					</Card>
				{/if}

				<AccountCard {user} form={data.userForm} />

				<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
					<SettingsForm {user} form={data.settingsForm} />
				</Card>

				<Card
					class="mb-6"
					title={m.shy_smug_crow_sing()}
					description={m.left_patchy_piranha_foster()}
				>
					<div class="mb-2">
						<ThemeForm form={data.themeForm} />
					</div>
					<DarkModeSwitcher variant="outline" />
				</Card>

				<form class="flex justify-center" method="post" action="?/logout">
					<Button type="submit" variant="outline"
						><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
					>
				</form>
			</Tabs.Content>
			<Tabs.Content value="api">
				<Card
					class="mb-6"
					title={m.super_funny_jackal_pause()}
					description={m.patchy_swift_fish_cuddle()}
				>
					{#if planLimits.apiAccess}
						<h3 class="mt-6 text-xl font-semibold">{m.actual_keen_rooster_find()}</h3>
						<ApiTokenForm {user} form={data.apiKeyForm} />

						{#if data.apiKeys.length}
							<h3 class="mt-6 mb-2 text-xl font-semibold">{m.lost_slimy_pelican_achieve()}</h3>
							{#each data.apiKeys as item}
								<div
									class="bg-background/60 border-border mb-3 grid grid-cols-[100px_1fr] gap-2 overflow-hidden border p-2 px-4 sm:grid-cols-[100px_1fr_min-content_min-content]"
								>
									<div
										class="max-w-full items-center justify-center self-center justify-self-start truncate text-sm"
									>
										{item.description}
									</div>
									<Input type="text" value={item.key} disabled />
									<div class="col-span-2 flex justify-end">
										<CopyButton variant="ghost" text={item.key}></CopyButton>

										<form
											class="flex justify-center"
											method="post"
											use:enhance
											action="?/revokeAPIToken"
										>
											<input type="hidden" name="keyId" value={item.id} />
											<Button type="submit" variant="ghost" class="text-destructive"
												><Trash class="me-2 h-4 w-4" />{m.tense_spicy_jannes_hug()}</Button
											>
										</form>
									</div>
								</div>
							{/each}
						{/if}
					{:else}
						<UpgradeNotice {user} />
					{/if}
					<Separator class="my-6" />

					<Button variant="outline" href={localizeHref('/developers')}
						>{m.deft_bright_insect_attend()}</Button
					>
				</Card>
			</Tabs.Content>
			<Tabs.Content value="secretService">
				{#if planLimits.whiteLabel && isAdminFlag}
					<OrganizationCard
						{user}
						organization={data.userOrganization}
						form={data.organizationForm}
					/>
				{/if}

				<Card
					class="mb-6"
					title={m.big_next_tortoise_ascend()}
					description={m.solid_north_ostrich_cheer()}
				>
					{#if planLimits.whiteLabel}
						<WhiteLabelForm
							{isAdminFlag}
							organizationIdOptions={data.organizationIdOptions}
							form={data.whiteLabelForm}
							whiteLabelDomain={data.whiteLabelDomain}
						/>
					{:else}
						<div class="text-destructive mb-2">{m.slow_zesty_whale_type()}</div>
						<Button href={localizeHref('/business')}>{m.only_weird_walrus_promise()}</Button>
						<Button variant="outline" target="_blank" href={whiteLabelDemoWebsite}
							>{m.lower_fine_okapi_imagine()}</Button
						>
					{/if}
				</Card>
			</Tabs.Content>
		</Tabs.Root>
	</Container>
</Page>
