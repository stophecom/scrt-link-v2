<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	import { Toaster } from '$lib/components/ui/sonner';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<ModeWatcher />
<Toaster />

<style>
	/* https://nerdy.dev/6-css-snippets-every-front-end-developer-should-know-in-2025#animated-adaptive-gradient-text */
	@property --color-1 {
		syntax: '<color>';
		inherits: false;
		initial-value: #000000;
	}

	@property --color-2 {
		syntax: '<color>';
		inherits: false;
		initial-value: #000000;
	}

	@keyframes color-change {
		50% {
			--color-1: var(--_color-1-to);
			--color-2: var(--_color-2-to);
		}
		100% {
			--color-1: var(--color-primary);
			--color-2: var(--color-foreground);
		}
	}

	:global(.gradient-text) {
		--_space: ;

		--_color-1-from: var(--color-foreground);
		--_color-1-to: var(--color-primary);
		--_color-2-from: var(--color-foreground);
		--_color-2-to: var(--color-primary);

		--color-1: var(--_color-1-from);
		--color-2: var(--_color-2-from);

		animation: color-change 10s linear infinite alternate;

		background: linear-gradient(to right var(--_space), var(--color-1), var(--color-2));

		/* old browser support */
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

		/* modern browser version */
		background-clip: text;
		color: transparent;
	}
</style>
