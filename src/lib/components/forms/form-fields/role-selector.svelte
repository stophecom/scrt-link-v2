<script lang="ts">
	import RadioGroup from '$lib/components/forms/form-fields/radio-group.svelte';
	import { MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	type Props = { value: MembershipRole | undefined };
	let { value = $bindable() }: Props = $props();

	const options = [
		{ value: MembershipRole.MEMBER, label: m.cuddly_flat_salmon_express() },
		{ value: MembershipRole.ADMIN, label: m.flat_warm_role_admin() },
		{ value: MembershipRole.OWNER, label: m.lower_few_turtle_propel() }
	];

	const descriptions = [
		{ label: m.cuddly_flat_salmon_express, desc: m.flat_warm_role_member_desc },
		{ label: m.flat_warm_role_admin, desc: m.flat_warm_role_admin_desc },
		{ label: m.lower_few_turtle_propel, desc: m.flat_warm_role_owner_desc }
	];
</script>

<RadioGroup {options} label={m.bad_close_anaconda_forgive()} bind:value />
<input type="hidden" name="role" bind:value />
<ul class="text-muted-foreground mt-2 space-y-0.5 text-xs">
	{#each descriptions as { label, desc } (label)}
		<li><span class="font-medium">{label()}</span>: {desc()}</li>
	{/each}
</ul>
