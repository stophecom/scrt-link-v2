<script lang="ts">
	import clientModule from '$lib/data/docs/client-module.md?raw';
	import clientModuleResponse from '$lib/data/docs/client-module-response.md?raw';

	import Markdown from '../ui/markdown';
</script>

{#snippet renderBox(title: string, description: string, code: string)}
	<div class="row-span-3 grid grid-rows-subgrid gap-1">
		<h4 class="text-lg font-semibold">{title}</h4>
		<p class="mb-2">{description}</p>
		<div class="bg-background border-border min-w-0 border p-2 text-sm">
			<Markdown markdown={code} formatCode />
		</div>
	</div>
{/snippet}

<div class="mb-4 grid gap-6 md:grid-cols-2">
	{@render renderBox(
		'Connect to the API',
		'The provided client module enables a simple and convenient way to interact with the API.',
		clientModule
	)}
	{@render renderBox(
		'API Response (JSON)',
		'In the background the client module interacts with the Rest API. No further setup needed.',
		clientModuleResponse
	)}
</div>
