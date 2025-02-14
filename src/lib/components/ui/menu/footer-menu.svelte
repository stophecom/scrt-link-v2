<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		title: string;
		menu: { href: string; label: string; externalLink?: boolean }[];
	};
	let { title, menu, class: className }: Props = $props();
</script>

<div class={cn(className)}>
	<h5 class="p-1 font-semibold">{title}</h5>
	<ul class="">
		{#each menu as menuItem}
			<li>
				<a
					class="block p-1 font-medium hover:underline"
					target={menuItem?.externalLink ? '_blank' : ''}
					href={menuItem.href}
				>
					{menuItem.label}
				</a>
			</li>
		{/each}
	</ul>
</div>
