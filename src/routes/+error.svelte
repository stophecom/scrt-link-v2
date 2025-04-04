<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="container py-30">
	<div class="mb-6 text-5xl font-bold">{page?.status || 'Unknown'}</div>
	<h1 class="text-4xl">{page?.error?.message || 'Error'}</h1>
</div>
