<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();
</script>

<Page title="Appearance" lead="Have it your way">
	<div class="grid gap-4">
		<div>
			<Button variant="ghost" href="/account"
				><ArrowLeft class="mr-2" />{m.stout_loved_marlin_enrich()}</Button
			>
		</div>
		<Card title="Theme">
			<ThemeForm form={data.themeForm} user={data.user} />
		</Card>
	</div>
</Page>
