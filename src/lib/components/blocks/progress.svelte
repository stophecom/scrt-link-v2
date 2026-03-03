<script lang="ts" module>
	import type { NavigationTarget } from '@sveltejs/kit';
	import { twMerge } from 'tailwind-merge';
	import { tv } from 'tailwind-variants';

	export type NavigationParams = { from: NavigationTarget | null; to: NavigationTarget | null };

	export const navbarVariants = tv({
		base: 'relative z-50 h-0.5 rounded-r-lg',
		variants: {
			size: {
				sm: 'h-0.5',
				md: 'h-1',
				lg: 'h-1.5'
			},
			color: {
				theme: 'bg-gradient-to-bl from-[var(--color-primary)] to-[var(--color-primary)]'
			}
		},
		defaultVariants: {
			size: 'sm',
			color: 'theme'
		}
	});

	type NavType = typeof navbarVariants;
	export interface ProgressProps {
		class?: string;
		size?: keyof NavType['variants']['size'];
		color?: keyof NavType['variants']['color'];
		initialDuration?: number;
		firstPhaseDuration?: number;
		secondPhaseDuration?: number;
		completionDuration?: number;
		resetDelay?: number;
		firstPhaseEasing?: (t: number) => number;
		secondPhaseEasing?: (t: number) => number;
		completionEasing?: (t: number) => number;
	}
</script>

<script lang="ts">
	import { cubicOut, linear } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let {
		size,
		color,
		class: className,
		initialDuration = 500,
		firstPhaseDuration = 900,
		secondPhaseDuration = 600,
		completionDuration = 800,
		resetDelay = 500,
		firstPhaseEasing = cubicOut,
		secondPhaseEasing = cubicOut,
		completionEasing = linear
	}: ProgressProps = $props();

	let progress = new Tween(0, { duration: initialDuration });
	let isVisible = $state(false);
	let delayTimer: ReturnType<typeof setTimeout> | undefined;

	const progressReset = () => {
		setTimeout(() => {
			progress.set(0, { duration: 0 });
			isVisible = false;
		}, resetDelay);
	};

	const progressStyle = $derived(
		`transform: scaleX(${progress.current / 100}); transform-origin: left;`
	);

	function isDiffNavigation(navigation: NavigationParams) {
		return navigation.from?.url.href === navigation.to?.url.href;
	}

	beforeNavigate(async (navigation) => {
		if (!isDiffNavigation(navigation)) {
			isVisible = false;
			if (delayTimer) clearTimeout(delayTimer);
			delayTimer = setTimeout(() => {
				isVisible = true;
			}, 200);

			await progress.set(0, { duration: 0 });
			await progress.set(35, { duration: firstPhaseDuration, easing: firstPhaseEasing });
			await progress.set(75, { duration: secondPhaseDuration, easing: secondPhaseEasing });
		} else {
			await progress.set(0, { duration: 0 });
		}
	});

	afterNavigate(async (navigation) => {
		if (!isDiffNavigation(navigation)) {
			if (delayTimer) clearTimeout(delayTimer);

			await progress.set(100, { duration: completionDuration, easing: completionEasing });
			progressReset();
		} else {
			if (delayTimer) clearTimeout(delayTimer);
			await progress.set(0, { duration: 0 });
			isVisible = false;
		}
	});
</script>

{#if isVisible}
	<div class="fixed top-0 left-0 z-110 w-full">
		<div
			class={twMerge(className, navbarVariants({ size, color }), 'w-full')}
			style={progressStyle}
		></div>
	</div>
{/if}
