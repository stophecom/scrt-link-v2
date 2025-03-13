<script lang="ts">
	import { navigating } from '$app/state';

	let current = $state(0);
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
		current = 0;
		interval = setInterval(inc, 300);
	}

	function done() {
		clearInterval(interval);
		current = 99;
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
	class="progress bg-primary fixed top-0 left-0 z-50 h-[2px] w-full opacity-100 transition-all {navigating.to
		? 'opacity-0'
		: 'opacity-100'}"
	style="--progress: {current}%"
></div>

<style>
	.progress {
		transform-origin: left;
		transform: scaleX(var(--progress));
	}
</style>
