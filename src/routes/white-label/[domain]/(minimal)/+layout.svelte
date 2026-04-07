<script lang="ts">
	import { type Snippet } from 'svelte';

	import Header from '../header.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();
</script>

<Header
	user={data.user}
	name={data?.name}
	logo={data.logo}
	logoDarkMode={data.logoDarkMode}
/>
{@render children()}
