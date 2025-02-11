<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import { legalMenu } from '$lib/data/menu';
</script>

<Page title="Imprint" lead="Tl;dr: Limited liability.">
	<div class="prose">
		SANTiHANS GmbH<br />
		CH-4056 Basel<br />
		UID: CHE-244.875.499 <br />
		<a href="mailto:info@santihans.com">info@santihans.com</a>

		<h2>Policies and Terms</h2>
		<ul>
			{#each legalMenu() as menuItem}
				<li>
					<a href={menuItem.href}>
						{menuItem.label}
					</a>
				</li>
			{/each}
		</ul>

		This project is supported by Flow Swiss AG - Premium cloud services from Zurich, Switzerland:
		<a target="_blank" href="https://flow.swiss">flow.swiss</a>
	</div>
</Page>
