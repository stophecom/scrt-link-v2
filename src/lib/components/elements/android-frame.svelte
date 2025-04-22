<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="deviceContainer">
	<div class="androidPhone black portrait shadow-2xl">
		<div class="caseBorder"></div>
		<div class="case"></div>
		<div class="screen"></div>
		<div class="camera"></div>
		<div class="speaker"></div>
		<div class="homeButtonBorder"></div>
		<div class="homeButton"></div>
		<div class="content">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.deviceContainer {
		display: block;
	}

	.deviceContainer .content {
		overflow: hidden;
	}

	/* Colors */
	.black .caseBorder {
		background: linear-gradient(#555 0%, #999 100%);
	}
	.black .case {
		background: linear-gradient(#111 0%, #333 100%);
	}
	.black .screen {
		background: rgba(0, 0, 0, 0);
		box-shadow: inset 0px 0px 5px 1px rgba(0, 0, 0, 0.25);
	}

	.black .camera {
		background: radial-gradient(#555 0%, #777 80%);
	}
	.black .speaker {
		background: linear-gradient(#555 0%, #777 80%);
	}
	.black .homeButtonBorder {
		background: #888;
	}
	.black .homeButton {
		background: #333;
	}
	/* Android phone portrait */

	.androidPhone.portrait {
		position: relative;
		display: inline-block;
		transform: scale3d(0.8333, 0.8333, 1);
		transform-origin: 50% 50%;
		width: 100%;
		padding: calc(16 / 9 * 50%) 0;
	}

	.androidPhone.portrait .content {
		position: absolute;
		z-index: 5;
		width: 100%;
		height: 100%;
		top: 0px;
	}

	.androidPhone.portrait .caseBorder {
		width: 107%;
		height: 120%;
		position: absolute;
		top: -10%;
		left: -3.5%;
		z-index: 0;
		border-radius: 10%/5%;
	}

	.androidPhone.portrait .case {
		width: 107%;
		height: 120%;
		position: absolute;
		top: -10%;
		left: -3.5%;
		z-index: 1;
		border-radius: 10%/5%;
		transform-origin: center;
		transform: scale3d(0.995, 0.995, 1);
	}

	.androidPhone.portrait .screen {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0%;
		left: 0%;
		z-index: 6;
		pointer-events: none;
	}

	.androidPhone.portrait .camera {
		width: 2%;
		height: calc(9 / 16 * 2%);
		position: absolute;
		top: -6%;
		left: 25%;
		z-index: 3;
		border-radius: 50%;
	}

	.androidPhone.portrait .speaker {
		width: 30%;
		height: calc(9 / 16 * 2%);
		position: absolute;
		top: -6%;
		left: 35%;
		z-index: 3;
		border-radius: 999px;
	}

	.androidPhone.portrait .homeButtonBorder {
		width: 25%;
		height: 5%;
		position: absolute;
		bottom: -7%;
		left: 37.5%;
		z-index: 3;
		border-radius: 999px;
	}

	.androidPhone.portrait .homeButton {
		width: 25%;
		height: 5%;
		position: absolute;
		bottom: -7%;
		left: 37.5%;
		z-index: 4;
		border-radius: 999px;
		transform-origin: center;
		transform: scale3d(0.9, 0.8, 1);
	}
</style>
