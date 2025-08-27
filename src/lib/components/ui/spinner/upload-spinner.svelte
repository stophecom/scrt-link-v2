<script lang="ts">
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import type { ClassValue } from 'svelte/elements';

	let props: { class?: ClassValue } = $props();
</script>

<div class={['flex justify-center', props.class]}>
	<div class="upload-spinner-icon">
		<ArrowUp class="h-4 w-4" />
	</div>
</div>

<style>
	.upload-spinner-icon {
		animation: upload 1s ease-in-out infinite;
	}

	@keyframes upload {
		0% {
			transform: translate(0, 50%);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(0, -50%);
			opacity: 0;
		}
	}
</style>
