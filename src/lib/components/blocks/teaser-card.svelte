<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description: string;
		image?: string;
		cta?: Snippet;
	};

	let { title, description, image, cta }: Props = $props();
</script>

<div class="border-rainbow relative rounded-lg p-0.5">
	<div
		class="bg-card relative grid grid-cols-1 overflow-hidden rounded-lg md:grid-cols-[minmax(60%,1fr)_auto]"
	>
		<div class="flex flex-col justify-center px-4 py-8 md:p-10">
			<h2 class="mt-2 mr-8 mb-2 text-2xl font-bold text-pretty md:text-3xl">
				{title}
			</h2>
			<p class="text-muted-foreground mb-6 text-pretty">
				{description}
			</p>
			{#if cta}
				<div>{@render cta()}</div>
			{/if}
		</div>

		{#if image}
			<div class="relative hidden min-h-48 w-56 overflow-hidden md:block lg:w-56">
				<img
					src={image}
					alt=""
					class="pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top"
				/>
			</div>
		{/if}
	</div>
</div>
