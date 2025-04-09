<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';

	let { children, ...rest }: { children?: Snippet } & SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	<header class="container">
		<div class="flex justify-between py-3">
			{@render children?.()}
			<div class="ml-auto flex">
				<DarkModeSwitcher hideLabel variant="ghost" size="icon" class="me-2" />
				<LanguageSwitcher />
			</div>
		</div>
	</header>
</div>
