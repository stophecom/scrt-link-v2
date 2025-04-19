<script lang="ts">
	import type { Snippet } from 'svelte';

	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		name?: string | null;
		title: string;
		lead?: string | null;
		logo?: string | null;
		children: Snippet;
	};

	let { name, title, lead, logo, children }: Props = $props();
</script>

<div class="container min-h-screen pt-8 pb-16">
	<div>
		<a
			class="inline-flex max-h-28 min-h-20 max-w-44 min-w-28 items-center md:max-h-32 md:min-w-32"
			href={localizeHref('/')}
		>
			{#if logo}
				<img src={logo} alt={title} class="w-full" />
			{:else}
				<div class="py-2 font-bold">
					{name}
				</div>
			{/if}
		</a>
	</div>

	<h1
		class="text-primary font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
	>
		{title}
	</h1>

	{#if lead}
		<p class="mb-10 text-2xl leading-snug text-pretty md:text-3xl">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html lead}
		</p>
	{/if}

	{@render children?.()}
</div>
