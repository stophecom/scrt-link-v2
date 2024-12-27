<script lang="ts">
	import SignupForm from './signup-form.svelte';

	export let data: PageData;

	import type { PageData } from './$types';
</script>

<h1 class="mb-5 text-4xl font-bold">Create account</h1>

<SignupForm data={data.form} />
