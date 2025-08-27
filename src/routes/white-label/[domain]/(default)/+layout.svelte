<script lang="ts">
	import { type Snippet } from 'svelte';

	import Container from '$lib/components/ui/container/container.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import Header from '../header.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();
</script>

<Header user={data.user} />
{@render children()}

<footer class="border-border bg-background border-t py-4 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<Container class="text-muted-foreground flex items-center justify-between">
		<span class="py-2 pe-4">©{new Date().getFullYear()} {data.name} </span>
		<small>{m.empty_spicy_firefox_fade()} <a href="https://scrt.link">scrt.link</a></small>
	</Container>
</footer>
