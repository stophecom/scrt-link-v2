<!-- 
This page is solely for backwards compatibility. 
We redirect to the old version of scrt.link now living under v1.scrt.link 
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteURL } from 'svelte/reactivity';

	onMount(async () => {
		try {
			const redirectUrl = new SvelteURL('https://v1.scrt.link/l'); // Where the legacy version lives
			const originalUrl = new URL(window.location.href);

			redirectUrl.hash = originalUrl.hash; // Append original hash
			window.location.replace(redirectUrl.toString());
		} catch (e) {
			console.error(e);
		}
	});
</script>
