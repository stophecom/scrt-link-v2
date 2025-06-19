<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Container from '$lib/components/ui/container/container.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = { user: App.Locals['user']; children?: Snippet };

	let { children, user, ...rest }: Props & SvelteHTMLElements['header'] = $props();
</script>

<header {...rest}>
	<Container class="flex justify-between py-3">
		{@render children?.()}
		<div class="ml-auto flex items-center">
			<DarkModeSwitcher hideLabel variant="ghost" size="icon" class="me-2" />
			<LanguageSwitcher />
			{#if user}
				<a href={localizeHref('/account')} class="relative ms-2">
					<Avatar.Root>
						<Avatar.Image src={user.picture} alt={user.name} />
						<Avatar.Fallback
							class="border-foreground bg-foreground text-background border uppercase"
							>{Array.from(user.email)[0]}</Avatar.Fallback
						>
					</Avatar.Root>
				</a>
			{/if}
		</div>
	</Container>
</header>
