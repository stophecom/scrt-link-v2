<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';

	import Page from '$lib/components/layout/page/page.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { accountMenu } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;
</script>

<Page
	title={m.zany_jolly_cuckoo_scoop({ name: user.name || m.quiet_long_beaver_scold() })}
	lead="Welcome back to your safe space."
>
	<Card>
		<div class="mb-4 flex flex-col items-center justify-center">
			<Avatar.Root class="h-16 w-16">
				<Avatar.Image src={user.picture} alt={user.name} />
				<Avatar.Fallback class="border-foreground bg-foreground text-background border uppercase"
					>{Array.from(user.email)[0]}</Avatar.Fallback
				>
			</Avatar.Root>
			<div class="py-2">{user.name || user.email}</div>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each accountMenu() as menuItem}
				<Button variant="outline" href={menuItem.href}>
					<menuItem.icon class="me-2 h-4 w-4" />{menuItem.label}
				</Button>
			{/each}

			<Button variant="outline" href="/set-password">{m.jumpy_factual_mole_hunt()}</Button>
			<form method="post" action="?/logout">
				<Button class="w-full" type="submit" variant="outline"
					><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
				>
			</form>
		</div>
	</Card>
</Page>
