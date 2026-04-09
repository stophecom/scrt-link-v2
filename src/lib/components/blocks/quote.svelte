<script lang="ts">
	import { Quote } from '@lucide/svelte';

	type Props = {
		text: string;
		author: string;
		role: string;
	};

	let { text, author, role }: Props = $props();
</script>

<figure class="mx-auto max-w-3xl py-6 text-center">
	<Quote class="text-muted-foreground/30 mx-auto mb-4 h-10 w-10" />
	<blockquote class="mb-4 text-lg leading-relaxed font-medium text-pretty italic md:text-xl">
		"{text}"
	</blockquote>
	<figcaption class="text-muted-foreground text-sm">
		<span class="text-foreground font-semibold">{author}</span> &mdash; {role}
	</figcaption>
</figure>
