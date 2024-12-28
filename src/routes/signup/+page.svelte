<script lang="ts">
	import type { PageData } from './$types';
	import SignupForm from './signup-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="mb-5 text-4xl font-bold">Create account</h1>

<SignupForm data={data.form} />
