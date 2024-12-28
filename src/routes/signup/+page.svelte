<script lang="ts">
	import SignupForm from '$lib/components/forms/signup-form.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="mb-5 text-4xl font-bold">Create account</h1>

<SignupForm data={data.form} />
