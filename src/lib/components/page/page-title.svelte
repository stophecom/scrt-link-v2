<script lang="ts">
	type Props = {
		title: string;
	};

	let { title }: Props = $props();
</script>

<h1
	class="gradient-text font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl"
>
	{title}
</h1>
