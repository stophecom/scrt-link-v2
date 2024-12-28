<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.name}!</h1>
<p>Your user ID is {data.user.id}.</p>
<p>Your user email is {data.user.email}.</p>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
