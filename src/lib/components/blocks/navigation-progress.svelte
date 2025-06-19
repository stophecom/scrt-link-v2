<script lang="ts">
	import { navigating } from '$app/state';

	let current = $state(0);
	let showProgress = $state(false);
	let interval: ReturnType<typeof setInterval>;
	const max = 95;
	const matrix = [
		[20, 15],
		[50, 3],
		[80, 1],
		[100, 0.5]
	];

	function inc() {
		var m = matrix.find((m) => current < m[0]);
		if (m) {
			current = Math.min(current + m[1], max);
		}
	}

	function start() {
		if (interval) {
			return;
		}
		showProgress = true;
		current = 0;
		interval = setInterval(inc, 300);
	}

	function done() {
		clearInterval(interval);
		current = 99;
		showProgress = false;
	}

	$effect(() => {
		if (navigating.to) {
			const initialDelay = setTimeout(start, 300);

			return () => {
				clearTimeout(initialDelay);
				done();
			};
		}
	});
</script>

<div
	class="progress bg-primary fixed top-0 left-0 z-50 h-[2px] w-full transition-all {showProgress
		? 'opacity-100'
		: 'opacity-0'}"
	style="--progress: {current}%"
></div>

<style>
	.progress {
		transform-origin: left;
		transform: scaleX(var(--progress));
	}
</style>
