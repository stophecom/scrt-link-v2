<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';

	import { cn } from '$lib/client/utils';

	import Markdown from '../ui/markdown';

	type Props = {
		Icon: typeof IconType;
		title: string;
		description: string;
		class?: string;
	};
	let { Icon, title, description, class: className }: Props = $props();
</script>

<div class={cn('grid grid-cols-[min-content_1fr] gap-4', className)}>
	<div>
		<div class="bg-muted rounded p-2">
			<Icon class="h-5 w-5" />
		</div>
	</div>
	<div>
		<h4 class="text-lg font-semibold">
			{title}
		</h4>
		<p class="text-pretty">
			<Markdown markdown={description} />
		</p>
	</div>
</div>
