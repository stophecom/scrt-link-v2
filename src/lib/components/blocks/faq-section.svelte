<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import Accordion from '$lib/components/ui/accordion';
	import business from '$lib/data/faq/business';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import Button from '../ui/button/button.svelte';
	import Container from '../ui/container/container.svelte';
	import { sectionVariants, type Variant } from '../ui/section';

	type FaqItem = { heading: string; body: string };

	type Props = {
		variant?: Variant;
		items?: FaqItem[];
	};

	let { variant, items = business(), ...rest }: Props & SvelteHTMLElements['section'] = $props();
</script>

<section {...rest} class={cn(sectionVariants({ variant }), rest.class)}>
	<Container variant="wide" class="grid gap-4 md:grid-cols-[160px_1fr]">
		<h2 class="font-display mt-3 mb-4 text-3xl font-bold sm:text-4xl">
			<abbr title={m.stock_keen_marten_commend()}>{m.few_awful_chipmunk_trust()}</abbr>
		</h2>
		<div class="flex flex-col gap-4">
			<Accordion {items} jsonLd />
			<div>
				<Button variant="outline" href={localizeHref('/faq')}>{m.inner_known_mare_breathe()}</Button
				>
			</div>
		</div>
	</Container>
</section>
