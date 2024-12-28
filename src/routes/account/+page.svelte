<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>{m.zany_jolly_cuckoo_scoop({ name: 'SvelteKit User' })}</h1>
<p>Your user ID is {data.user.id}.</p>

<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
