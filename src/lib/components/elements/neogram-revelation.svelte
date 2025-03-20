<script lang="ts">
	import CountDown from '$lib/components/ui/count-down';
	import { m } from '$lib/paraglide/messages.js';

	import Typewriter from '../helpers/typewriter.svelte';

	type Props = { neogram?: string };

	const DURATION = 5; // Countdown in seconds

	let { neogram }: Props = $props();

	let finished = $state(false);
	let blur = $state(false);
</script>

<div class="bg-background fixed top-0 left-0 z-50 h-full w-full p-3">
	<div class="container grid h-full grid-rows-[min-content_1fr]">
		<div class="min-h-3 pb-2">
			{#if finished}
				<CountDown
					duration={DURATION}
					onComplete={() => {
						setTimeout(() => {
							// We wait for the transition to run.
							blur = true;
							window.location.reload();
						}, 800);
					}}
				/>
			{/if}
		</div>
		{#if neogram}
			<div class={blur ? 'blur-lg' : undefined}>
				<Typewriter
					message={neogram}
					delay={1000}
					interval={40}
					className="sm:text-lg"
					onDone={() => {
						finished = true;
					}}
				/>
				{#if finished}
					<Typewriter
						message={m.red_glad_samuel_grip()}
						delay={1000}
						interval={40}
						className="sm:text-lg"
					/>
				{/if}
			</div>
		{:else}
			<div
				class="bg-muted flex max-h-[min(100%,_1000px)] min-h-0 max-w-full animate-pulse items-center justify-center"
			></div>
		{/if}
	</div>
</div>
