<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>{m.zany_jolly_cuckoo_scoop({ name: data.user.name || 'Foo' })}</h1>
<p>Your user ID is {data.user.id}.</p>
<img src={data.user.picture} alt={data.user.name} />
<p>Your Google ID is {data.user.googleId}</p>
<p>Your email is {data.user.email}.</p>

<form method="post" action="?/logout" use:enhance>
	<Button type="submit" variant="outline">Sign out</Button>
</form>
