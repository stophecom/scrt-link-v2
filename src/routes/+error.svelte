<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>{page?.error?.message || 'foobar b'}</h1>
