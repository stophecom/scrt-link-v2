<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let props: { class?: ClassValue } = $props();
</script>

<div class={['flex scale-75 justify-center', props.class]}>
	<div class="banter-loader">
		<!-- Dynamically generate 9 boxes -->
		<div class="banter-loader__box" style="--i:1;"></div>
		<div class="banter-loader__box" style="--i:2;"></div>
		<div class="banter-loader__box" style="--i:3;"></div>
		<div class="banter-loader__box" style="--i:4;"></div>
		<div class="banter-loader__box" style="--i:5;"></div>
		<div class="banter-loader__box" style="--i:6;"></div>
		<div class="banter-loader__box" style="--i:7;"></div>
		<div class="banter-loader__box" style="--i:8;"></div>
		<div class="banter-loader__box" style="--i:9;"></div>
	</div>
</div>

<style>
	.banter-loader {
		--size: 4px;
		--gap: 2px;
		--main-bg-color: currentColor;
		display: grid;
		grid-template-columns: repeat(3, var(--size));
		grid-template-rows: repeat(3, var(--size));
		gap: var(--gap);
	}

	.banter-loader__box {
		width: var(--size);
		height: var(--size);
		background: var(--main-bg-color);
		animation: moveBox 4s infinite ease-in-out;
		animation-delay: calc(var(--i) * 0.1s);
	}

	@keyframes moveBox {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(calc(var(--i) * 5%), -13%);
			opacity: 0;
		}
		50% {
			transform: translate(-10%, 33%);
		}
		75% {
			transform: translate(51%, 12%);
		}
	}
</style>
