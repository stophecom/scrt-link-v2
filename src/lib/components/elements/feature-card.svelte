<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';

	type Props = {
		Icon: typeof IconType;
		title: string;
		description: string;
	};
	let { Icon, title, description }: Props = $props();
</script>

<div class="grid grid-cols-[min-content_1fr] gap-4 p-4">
	<div>
		<div class="bg-muted rounded p-2">
			<Icon class="h-5 w-5" />
		</div>
	</div>
	<div>
		<h4 class="text-lg font-semibold">
			{title}
		</h4>
		<p class="">
			{description}
		</p>
	</div>
</div>
