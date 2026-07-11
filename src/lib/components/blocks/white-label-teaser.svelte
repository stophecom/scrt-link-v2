<script lang="ts">
	import { Palette } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<div class="white-label-teaser border-rainbow relative rounded-lg p-0.5">
	<div
		class="bg-card relative grid grid-cols-1 overflow-hidden rounded-lg md:grid-cols-[minmax(60%,1fr)_auto]"
	>
		<div class="flex flex-col justify-center px-4 py-8 md:p-10">
			<h2 class="mt-2 mr-8 mb-2 text-2xl font-bold text-pretty md:text-3xl">
				{m.home_white_label_teaser_title()}
			</h2>
			<p class="text-muted-foreground mb-6 text-pretty">
				{m.home_white_label_teaser_lead()}
			</p>
			<div>
				<Button size="lg" href={localizeHref('/business')}>
					<Palette class="me-2 h-5 w-5" />
					{m.home_white_label_teaser_cta()}
				</Button>
			</div>
		</div>

		<div class="relative hidden min-h-48 w-56 overflow-hidden md:block lg:w-56">
			<div class="pointer-events-none absolute top-10 -right-12 left-0 h-75 origin-top">
				<AndroidFrame>
					<video autoplay loop muted playsinline>
						<source src="/videos/br3f-demo.mp4" type="video/mp4" />
					</video>
				</AndroidFrame>
			</div>
		</div>
	</div>
</div>

<style>
	.white-label-teaser :global(.caseBorder) {
		box-shadow:
			0 0 4px rgba(59, 130, 246, 0.2),
			0 0 8px rgba(139, 92, 246, 0.15),
			0 0 12px rgba(236, 72, 153, 0.1);
	}
</style>
