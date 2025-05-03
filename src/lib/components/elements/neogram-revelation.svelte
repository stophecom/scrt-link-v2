<script lang="ts">
	import CountDown from '$lib/components/ui/count-down';
	import { m } from '$lib/paraglide/messages.js';

	import Typewriter from '../helpers/typewriter.svelte';
	import Container from '../ui/container/container.svelte';

	type Props = { neogram?: string; neogramDestructionTimer?: number };

	let { neogram, neogramDestructionTimer = 5 }: Props = $props();

	let finished = $state(false);
	let blur = $state(false);
</script>

<div class="bg-background fixed top-0 left-0 z-50 h-full w-full p-3">
	<Container class="grid h-full grid-rows-[min-content_1fr]">
		<div class="min-h-3 pb-2">
			{#if finished}
				<CountDown
					duration={neogramDestructionTimer}
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
			<div class="max-w-full overflow-hidden {blur ? 'blur-lg' : undefined}">
				<Typewriter
					message={neogram}
					delay={1000}
					interval={40}
					className="sm:text-lg text-wrap break-words"
					onDone={() => {
						finished = true;
					}}
				/>
				{#if finished}
					<Typewriter
						message={m.red_glad_samuel_grip()}
						delay={1000}
						interval={40}
						className="mt-4 sm:text-lg text-wrap break-words"
					/>
				{/if}
			</div>
		{:else}
			<div
				class="bg-muted flex max-h-[min(100%,_1000px)] min-h-0 max-w-full animate-pulse items-center justify-center"
			></div>
		{/if}
	</Container>
</div>
