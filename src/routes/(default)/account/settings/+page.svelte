<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();
</script>

<Page title={m.nimble_quick_bird_sew()} lead={m.wacky_key_vole_roam()}>
	<div class="grid gap-4">
		<div>
			<Button variant="ghost" href="/account"
				><ArrowLeft class="mr-2" />{m.still_key_hornet_adapt()}</Button
			>
		</div>
		<Card title={m.vivid_house_flea_zap()}>
			<SettingsForm form={data.settingsForm} user={data.user} />

			<CardTitle class="mt-12">{m.novel_proud_anaconda_zoom()}</CardTitle>
			<div class="mb-2">
				<Button variant="outline" href="/set-password">{m.jumpy_factual_mole_hunt()}</Button>
			</div>
			<Button variant="outline" href="/delete-account" class="text-destructive"
				>{m.home_sharp_jackdaw_endure()}</Button
			>
		</Card>
	</div>
</Page>
