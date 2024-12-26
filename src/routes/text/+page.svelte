<script lang="ts">
	import type { PageData } from './$types.js';
	import SettingsForm from './form.svelte';
	export let data: PageData;
</script>

<SettingsForm data={data.form} />
