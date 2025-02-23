<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		duration?: number;
		showTimer?: boolean;
		onComplete?: () => void;
	};
	let { duration = 5, onComplete = () => {}, class: className, showTimer }: Props = $props();

	let timeLeft = $state(duration);
	let timer: ReturnType<typeof setInterval>;

	function startCountdown() {
		clearInterval(timer); // Ensure no duplicate timers
		timeLeft = duration;

		timer = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
			} else {
				clearInterval(timer);
				onComplete(); // Call function when done
			}
		}, 1000);
	}
	startCountdown();
</script>

<div class="flex items-center">
	<div class="relative h-1 w-full" style="--duration: {duration}s">
		<div class="progress-bar bg-primary absolute top-0 left-0 h-full"></div>
	</div>
	{#if showTimer}
		<span class={cn('text-sm', className)}>{timeLeft}</span>
	{/if}
</div>

<style>
	.progress-bar {
		animation-duration: var(--duration);
		animation-name: progress;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	@keyframes progress {
		0% {
			width: 100%;
		}
		100% {
			width: 0%;
		}
	}
</style>
