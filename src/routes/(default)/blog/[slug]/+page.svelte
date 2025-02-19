<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';

	let { data } = $props();
	console.log(data.meta);
	console.log(data.content);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<Page title={data.meta.title} lead="todo">
	<article>
		<hgroup>
			<p>Published at {data.meta.date}</p>
		</hgroup>

		<div class="tags">
			{#each data.meta.categories as category}
				<span class="surface-4">&num;{category}</span>
			{/each}
		</div>

		<div class="prose">
			<!--  eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content.body}
		</div>
	</article>
</Page>
