<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	import Page from '$lib/components/layout/page/page.svelte';

	import BlogMeta from './blog-meta.svelte';

	let { data } = $props();
</script>

<Page title="Blog" lead="Product updates, privacy and the web." markNotTranslated>
	<section>
		<ul class="grid gap-4">
			{#each data.posts as post}
				<li>
					<a
						class="group bg-background border-border flex w-full rounded border-b transition-all"
						href="/blog/{post.slug}"
					>
						<div class="rounded py-5 md:py-6">
							<h2 class="mb-2 text-xl font-bold text-pretty md:text-2xl">
								{post.title}
							</h2>

							<BlogMeta class="mb-2" date={post.date} categories={post.categories} />

							<p class="text-lg text-pretty">{post.description}</p>

							<div class="flex justify-between pt-4">
								<div
									class="text-primary after:bg-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100"
								>
									Read more
								</div>
								<ArrowRight
									class="group-hover:text-primary -translate-x-4 opacity-0 transition-all delay-200 group-hover:translate-x-0 group-hover:opacity-100"
								/>
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</Page>
