<script lang="ts">
	import type { Snippet } from 'svelte';

	import PageLead from '../page/page-lead.svelte';
	import PageTitle from '../page/page-title.svelte';
	import AndroidFrame from './android-frame.svelte';

	type Props = {
		title: string;
		lead?: string | Snippet;

		children: Snippet;
	};

	let { title, lead, children }: Props = $props();
</script>

<div class="grid grid-cols-[65%_1fr] gap-6 pt-20">
	<div>
		<PageTitle {title} />

		{#if lead}
			<PageLead {lead} renderAsHtml />
		{/if}

		{@render children?.()}
	</div>
	<div>
		<AndroidFrame>
			<video autoplay loop muted>
				<source src="/videos/scrt-link-blue-short.mp4" type="video/mp4" />
			</video>
		</AndroidFrame>
	</div>
</div>
