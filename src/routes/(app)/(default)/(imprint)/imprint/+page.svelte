<script lang="ts">
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import imprint from '$lib/data/imprint.md?raw';
	import { legalMenu } from '$lib/data/menu';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<Page title={m.broad_green_hamster_exhale()} lead={m.solid_lofty_nuthatch_devour()}>
	<Container class="prose">
		<Markdown markdown={imprint} />

		<h2>{m.even_icy_shell_compose()}</h2>
		<ul>
			{#each legalMenu() as menuItem, i (i)}
				<li>
					<a href={localizeHref(menuItem.href)}>
						{menuItem.label}
					</a>
				</li>
			{/each}
		</ul>

		<Markdown markdown={m.happy_petty_osprey_zap({ link: '[flow.swiss](https://flow.swiss)' })} />
	</Container>
</Page>
