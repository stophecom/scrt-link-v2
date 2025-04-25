<script lang="ts">
	import { fade } from 'svelte/transition';

	import CountDown from '$lib/components/ui/count-down';
	import { m } from '$lib/paraglide/messages.js';

	import Container from '../ui/container/container.svelte';

	type Props = { imageUrl?: string };

	let { imageUrl }: Props = $props();

	let finished = $state(false);
</script>

<div class="bg-background fixed top-0 left-0 z-50 h-full w-full p-3">
	<Container class="grid h-full grid-rows-[min-content_1fr]">
		<div class="pb-2">
			{#if imageUrl}
				<CountDown
					onComplete={() => {
						finished = true;
						setTimeout(() => {
							// We wait for the transition to run.
							window.location.reload();
						}, 800);
					}}
				/>
			{:else}
				<div class="bg-muted h-1 animate-pulse"></div>
			{/if}
		</div>
		{#if imageUrl}
			<img
				in:fade
				src={imageUrl}
				alt={m.bold_factual_parakeet_reap()}
				class="mx-auto max-h-[min(100%,_1000px)] min-h-0 max-w-full self-center justify-self-center rounded-md object-scale-down transition-all duration-1000 {finished
					? 'blur-lg'
					: undefined}"
			/>
		{:else}
			<div
				class="bg-muted flex max-h-[min(100%,_600px)] min-h-0 max-w-full animate-pulse items-center justify-center"
			></div>
		{/if}
	</Container>
</div>
