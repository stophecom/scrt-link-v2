<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button/index.js';
</script>

<header class="h-16">
	<div class="fixed left-0 top-0 h-16 w-full bg-background">
		<div class="container flex h-full items-center">
			<div class="grid grid-flow-col gap-2">
				<a href="/text">Text</a>
				<Button href="/signup">Sign up</Button>
				<Button href="/signin">Sign in</Button>

				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</div>
	<slot />
</header>
