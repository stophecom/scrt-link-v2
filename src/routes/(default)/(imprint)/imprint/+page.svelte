<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import { legalMenu } from '../../../../lib/data/menu';
</script>

<Page title={m.broad_green_hamster_exhale()} lead={m.solid_lofty_nuthatch_devour()}>
	<div class="prose">
		SANTiHANS GmbH<br />
		CH-4056 Basel<br />
		UID: CHE-244.875.499 <br />
		<a href="mailto:info@santihans.com">info@santihans.com</a>

		<h2>{m.even_icy_shell_compose()}</h2>
		<ul>
			{#each legalMenu() as menuItem}
				<li>
					<a href={localizeHref(menuItem.href)}>
						{menuItem.label}
					</a>
				</li>
			{/each}
		</ul>

		<Markdown markdown={m.happy_petty_osprey_zap({ link: '[flow.swiss](https://flow.swiss)' })} />
	</div>
</Page>
