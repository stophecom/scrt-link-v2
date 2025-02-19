<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';

	let { data } = $props();
	console.log(data);
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<Page title="Blog" lead="todo">
	<section>
		<ul class="posts">
			{#each data.posts as post}
				<li class="post">
					<a href={post.slug} class="title">{post.title}</a>
					<p class="date">{post.date}</p>
					<p class="description">{post.description}</p>
				</li>
			{/each}
		</ul>
	</section>
</Page>
