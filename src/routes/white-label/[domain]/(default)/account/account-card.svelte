<script lang="ts">
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { m } from '$lib/paraglide/messages.js';
	import type { UserFormSchema } from '$lib/validators/formSchemas';

	let {
		user,
		form,
		organizationName
	}: {
		user: App.Locals['user'];
		form: SuperValidated<UserFormSchema>;
		organizationName?: string | null;
	} = $props();
</script>

{#snippet renderLabel(label: string)}
	<span class="inline-block p-1 font-medium">{label}</span>
{/snippet}

<Card class="mb-6" title={m.novel_proud_anaconda_zoom()} description={m.warm_bright_fox_greet()}>
	<div class="flex items-center py-1">
		{@render renderLabel('Name:')}
		<span class="p-1">{form.data.name || 'Anonymous'}</span>
	</div>

	<div class="flex py-1">
		{@render renderLabel(m.mild_noble_orangutan_compose())}
		<span class="inline-flex cursor-not-allowed items-center p-1"
			>{user?.email} <BadgeCheck class="text-muted-foreground ms-2 h-4 w-4" /></span
		>
	</div>

	{#if organizationName}
		<div class="flex items-center py-1">
			{@render renderLabel(m.keen_calm_wolf_watch())}
			<span class="p-1">{organizationName}</span>
		</div>
	{/if}

	<Separator class="my-6" />
	<div class="flex flex-wrap">
		<Button class="mr-2 mb-2" variant="outline" href="https://scrt.link/account/profile">
			<img src="/logo.png" alt="scrt.link" class="mr-1 h-5 w-5" />
			{m.bold_swift_elk_march()}
		</Button>
	</div>
</Card>
