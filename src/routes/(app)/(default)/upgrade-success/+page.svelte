<script lang="ts">
	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import Page from '$lib/components/page/default-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import { getPlanContents } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	const plan = $derived(getPlanContents(data.planName));
	const PlanIcon = $derived(plan.icon);
	const ctaHref = $derived(localizeHref(plan.isOrgPlan ? '/account/organization' : '/account'));
</script>

<Page
	title={m.pretty_aloof_owl_yell()}
	lead={m.dull_flat_loris_bless({ trialPeriod: TRIAL_PERIOD_DAYS })}
>
	<Container class="flex flex-col items-start gap-6">
		<p class="text-lg">
			{m.still_icy_donkey_fold()}
			<span class="inline-flex items-center">
				<strong>{plan.name}</strong>
				<PlanIcon class="text-primary ms-2 h-5 w-5" />
			</span>
		</p>

		<Button href={ctaHref}>{m.grand_proud_otter_cheer()}</Button>
	</Container>
</Page>
