<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		once?: boolean;
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
		children?: Snippet<[boolean]>;
	}

	let { once = false, top = 0, bottom = 0, left = 0, right = 0, children }: Props = $props();

	let intersecting = $state(true);
	let container: HTMLElement | undefined = $state();

	$effect(() => {
		if (!container) return;

		if (typeof IntersectionObserver !== 'undefined') {
			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

			const observer = new IntersectionObserver(
				(entries) => {
					intersecting = entries[0].isIntersecting;
					if (intersecting && once) {
						observer.unobserve(container!);
					}
				},
				{
					rootMargin
				}
			);

			observer.observe(container);
			return () => observer.unobserve(container!);
		}

		function handler() {
			if (!container) return;
			const bcr = container.getBoundingClientRect();
			intersecting =
				bcr.bottom + bottom > 0 &&
				bcr.right + right > 0 &&
				bcr.top - top < window.innerHeight &&
				bcr.left - left < window.innerWidth;

			if (intersecting && once) {
				window.removeEventListener('scroll', handler);
			}
		}

		window.addEventListener('scroll', handler);
		return () => window.removeEventListener('scroll', handler);
	});
</script>

<div bind:this={container}>
	{@render children?.(intersecting)}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
