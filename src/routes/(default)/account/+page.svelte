<script lang="ts">
	import { enhance } from '$app/forms';
	import Page from '$lib/components/layout/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<Page title={m.zany_jolly_cuckoo_scoop({ name: data.user.name || 'Foo' })}>
	<p>Your user ID is {data.user.id}.</p>
	<img src={data.user.picture} alt={data.user.name} />
	<p>Your Google ID is {data.user.googleId}</p>
	<p>Your email is {data.user.email}.</p>

	<div class="grid gap-2">
		<div>
			<Button variant="outline" href="/set-password">Change password</Button>
		</div>
		<form method="post" action="?/logout" use:enhance>
			<Button type="submit" variant="outline">Sign out</Button>
		</form>
	</div>
</Page>
