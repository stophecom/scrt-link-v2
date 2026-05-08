<script lang="ts">
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Section } from '$lib/components/ui/section';
	import business from '$lib/data/faq/business';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<Section wide title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
	<Accordion items={business()} />
	<Button variant="outline" href={localizeHref('/faq')}>{m.inner_known_mare_breathe()}</Button>
</Section>
