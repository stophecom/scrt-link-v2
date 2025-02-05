<script lang="ts">
	import ArrowUpFromLine from 'lucide-svelte/icons/arrow-up-from-line';

	import gif from '$lib/assets/images/snoop.webp';
	import { GB } from '$lib/data/units';
	import * as m from '$lib/paraglide/messages.js';

	const MAX_FILE_SIZE = 1 * GB; // @todo make dynamic

	let isOver = $state(false);

	type OnDrop = (files: File[]) => void;
	type OnEnter = () => void;
	type OnLeave = () => void;
	type OnError = (e: string) => void;

	type Props = {
		onEnter?: OnEnter;
		onLeave?: OnLeave;
		onDrop: OnDrop;
		onError: OnError;
		multiple?: boolean;
		disabled?: boolean;
		accept?: string; // image/*, .gif etc.
	};
	let { onError, onDrop, onEnter, onLeave, multiple = false, disabled, accept }: Props = $props();

	const validateFiles = (files: File[]) => {
		if (!multiple) {
			if (files.length > 1) {
				handleError(m.grand_level_herring_sail());
				return false;
			}
		}

		// Since we only allow one file, checking first file only
		if (files[0].size > MAX_FILE_SIZE) {
			handleError(m.slimy_royal_lamb_roar({ amount: MAX_FILE_SIZE / GB }));
			return false;
		}
		return true;
	};

	const handleEnter = () => {
		isOver = true;
		if (onEnter) {
			onEnter();
		}
	};
	const handleLeave = () => {
		isOver = false;
		if (onLeave) {
			onLeave();
		}
	};

	const handleError = (e: string) => {
		onError(e);
		isOver = false;

		return;
	};
	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		if (disabled) {
			return;
		}

		if (!e?.dataTransfer?.items) {
			return;
		}
		const files = Array.from(e.dataTransfer.files);

		if (validateFiles(files)) {
			onDrop(files);
			isOver = false;
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		if (!isOver) {
			isOver = true;
		}
	};

	const handleChange = (e: Event) => {
		e.preventDefault();
		const input = e.currentTarget as HTMLInputElement;
		const fileList = input.files;

		if (!fileList) return;
		const files = Array.from(fileList);

		if (validateFiles(files)) {
			onDrop(files);
		}
	};
</script>

<svelte:body
	ondragenter={handleEnter}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	ondragleave={handleLeave}
/>

<div
	class="hover:shadow-black-200/50 relative rounded-2xl border border-foreground text-foreground shadow-lg shadow-foreground/30 transition focus-within:border-solid focus-within:shadow-lg focus-within:outline-none hover:border-solid dz:rounded-lg dz:border-dashed dz:bg-background/70 dz:text-foreground dz:shadow-none dz:hover:shadow-lg"
>
	<div class="sm:p-4 flex flex-col items-center justify-center p-2">
		<div class="mb-2 flex pt-2">
			<ArrowUpFromLine class="h-6 w-6" />
		</div>
		<!-- We show a simple button on smaller screens, and a drag/onDrop area on larger screens. -->
		<span class="hidden text-center dz:inline">{m.ideal_jumpy_lionfish_scold()}</span>
		<span class="text-center text-lg dz:hidden">{m.gray_free_manatee_buy()}</span>
	</div>

	<div
		id="overlay"
		class="pointer-events-none fixed left-0 top-0 flex h-full w-full items-end justify-center rounded-lg bg-black opacity-0"
		style={isOver ? 'opacity: 1;' : ''}
	>
		<img class="absolute h-full w-full object-cover" alt="Snoop Dogg" src={gif} />
		<div
			class="md:text-8xl absolute w-full bg-gradient-to-b from-transparent to-black p-12 pb-16 text-center text-6xl font-bold uppercase text-white"
		>
			OnDrop it like it's hot
		</div>
	</div>
	<label class="sr-only" for="dropzone">{m.gross_nice_gecko_compose()}</label>
	<input
		id="dropzone"
		class="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
		type="file"
		{multiple}
		{accept}
		{disabled}
		onchange={handleChange}
	/>
</div>
