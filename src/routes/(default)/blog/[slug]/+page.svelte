<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	import Page from '$lib/components/layout/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ShareButton from '$lib/components/ui/share-button';
	import * as m from '$lib/paraglide/messages.js';

	import BlogMeta from '../blog-meta.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:image" content={data.meta.ogImage} />
</svelte:head>

<Page title={data.meta.title} lead={data.meta.lead} markNotTranslated={true}>
	<article class="mb-12">
		<div class=" my-4 flex items-center justify-between py-2">
			<BlogMeta date={data.meta.date} categories={data.meta.categories} />
		</div>
		<div class="prose">
			<!--  eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content.body}
		</div>
	</article>
	<ShareButton
		label={m.fluffy_gaudy_turkey_yell()}
		variant="outline"
		url={`${data.baseUrl}/blog/${data.meta.slug}`}
		text={data.meta.title}
	/>
	<Separator class="my-6" />
	<section class="flex">
		<Button variant="ghost" href="/blog"
			><ArrowLeft class="mr-2" />{m.royal_dull_baboon_advise()}</Button
		>
	</section>
</Page>
