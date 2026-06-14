<script lang="ts">
	import SocialLinks from '$lib/components/blocks/social-links.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.polite_misty_jan_hint()}
	lead={m.such_bright_panther_rush()}
	metaDescription={m.safe_main_okapi_smile()}
	metaKeywords={m.topical_lost_beaver_bump()}
>
	<Container>
		<Markdown markdown={m.polite_clean_canary_walk()} format={true} />
		<div class="mt-6">
			<h5 class="text-primary mb-1 font-semibold">{m.social_follow_heading()}</h5>
			<SocialLinks class="-ms-2" />
		</div>
	</Container>
</Page>
