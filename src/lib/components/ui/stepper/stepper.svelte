<script lang="ts">
	import { Check } from '@lucide/svelte';

	import { cn } from '$lib/client/utils';

	import type { Step } from './index.js';

	let {
		steps,
		currentStep,
		class: className
	}: {
		steps: Step[];
		currentStep: number;
		class?: string;
	} = $props();
</script>

<nav aria-label="Progress" class={cn('w-full', className)}>
	<ol class="@container flex items-center px-1 py-2 sm:px-5">
		{#each steps as step, i (i)}
			{@const isCompleted = step.completed}
			{@const isCurrent = i === currentStep}

			<li class={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
				<div class="relative flex flex-col items-center gap-1.5 pb-6">
					<!-- Circle -->
					<div
						class={cn(
							'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
							isCompleted && 'bg-primary text-primary-foreground',
							isCurrent && !isCompleted && 'border-primary text-primary border-2 bg-transparent',
							!isCurrent &&
								!isCompleted &&
								'border-muted-foreground/30 text-muted-foreground border-2'
						)}
					>
						{#if isCompleted}
							<Check class="h-4 w-4" />
						{:else}
							{i + 1}
						{/if}
					</div>
					<!-- Label -->
					<span
						class={cn(
							'absolute top-full left-1/2 -translate-x-1/2 -translate-y-4 px-1 text-center text-xs font-medium wrap-break-word hyphens-auto',
							i === 0 && 'left-0 translate-x-0 text-left',
							i === steps.length - 1 && 'right-0 left-auto translate-x-0 text-right',
							isCompleted && 'text-foreground',
							isCurrent && !isCompleted && 'text-primary',
							!isCurrent && !isCompleted && 'text-muted-foreground'
						)}
						style="width: {100 / steps.length}cqw"
					>
						{step.label}
					</span>
				</div>

				<!-- Connector line -->
				{#if i < steps.length - 1}
					<div
						class={cn(
							'mx-2 mb-5 h-0.5 flex-1',
							step.completed ? 'bg-primary' : 'bg-muted-foreground/30'
						)}
					></div>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
