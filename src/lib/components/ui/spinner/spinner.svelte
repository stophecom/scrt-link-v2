<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let props: { class?: string } = $props();
</script>

<LoaderCircle class="animate-spin {props.class ?? ''}" />
