<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.awake_frail_kitten_hush()}
	lead={m.fit_slimy_hamster_thrive()}
	metaDescription={m.sound_fun_kestrel_fear()}
	metaKeywords={m.quick_sunny_ocelot_roam()}
>
	<Container>
		<Markdown markdown={m.trick_tidy_monkey_grow()} format={true} />
	</Container>
</Page>
