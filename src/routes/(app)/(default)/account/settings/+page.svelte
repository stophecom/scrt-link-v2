<script lang="ts">
	import DarkModeSwitcher from '$lib/components/blocks/dark-mode-switcher.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import Card from '$lib/components/ui/card';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { user } = data;
</script>

<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
	<SettingsForm {user} form={data.settingsForm} />
</Card>

<Card class="mb-6" title={m.shy_smug_crow_sing()} description={m.left_patchy_piranha_foster()}>
	<div class="mb-2">
		<ThemeForm form={data.themeForm} />
	</div>
	<DarkModeSwitcher variant="outline" />
</Card>
