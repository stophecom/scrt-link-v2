<script lang="ts">
	import { cn } from '$lib/client/utils';
	import { blueskyUrl, linkedinUrl } from '$lib/data/app';

	let { class: className }: { class?: string } = $props();

	const socialLinks = [
		{
			label: 'Bluesky',
			href: blueskyUrl,
			path: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z'
		},
		{
			label: 'LinkedIn',
			href: linkedinUrl,
			path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
		}
	];
</script>

<div class={cn('flex items-center gap-1', className)}>
	{#each socialLinks as { label, href, path } (label)}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a
			class="text-muted-foreground hover:text-foreground inline-flex p-2 transition-colors"
			{href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d={path} />
			</svg>
		</a>
	{/each}
</div>
