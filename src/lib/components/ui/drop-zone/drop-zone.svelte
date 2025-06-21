<script lang="ts">
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';

	import gif from '$lib/assets/images/snoop.webp';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	import { GB } from '../../../data/units';

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
		maxFileSize?: number;
		disabled?: boolean;
		accept?: string; // image/*, .gif etc.
		labelButton?: string;
		labelDropzone?: string;
	};
	let {
		onError,
		onDrop,
		onEnter,
		onLeave,
		multiple = false,
		maxFileSize = 1 * GB,
		disabled,
		accept,
		labelButton = m.gray_free_manatee_buy(),
		labelDropzone = m.ideal_jumpy_lionfish_scold()
	}: Props = $props();

	const validateFiles = (files: File[]) => {
		if (!multiple) {
			if (files.length > 1) {
				handleError(m.grand_level_herring_sail());
				return false;
			}
		}

		// Since we only allow one file, checking first file only
		if (files[0].size > maxFileSize) {
			handleError(m.slimy_royal_lamb_roar({ amount: formatBytes(maxFileSize) }));
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
	class="hover:shadow-black-200/50 border-foreground bg-background/70 text-foreground dz:rounded-lg dz:border-dashed dz:text-foreground dz:shadow-none dz:hover:shadow-lg relative rounded-2xl border transition focus-within:border-solid focus-within:shadow-lg focus-within:outline-hidden hover:border-solid"
>
	<div class="flex h-full flex-col items-center justify-center p-2 sm:p-4">
		<div class="mb-1 flex pt-1">
			<ArrowUpFromLine class="h-5 w-5" />
		</div>
		<!-- We show a simple button on smaller screens, and a drag/onDrop area on larger screens. -->
		<span class="dz:inline hidden text-center">{labelDropzone}</span>
		<span class="dz:hidden text-center text-lg">{labelButton}</span>
	</div>

	<div
		id="overlay"
		class="pointer-events-none fixed top-0 left-0 z-50 flex h-full w-full items-end justify-center rounded-lg bg-[#000000] {isOver
			? 'flex'
			: 'hidden'}"
	>
		<img class="absolute h-full w-full object-cover" alt="Snoop Dogg" src={gif} />
		<div
			class="absolute w-full bg-linear-to-b from-transparent to-black p-12 pb-16 text-center text-6xl font-bold text-[#ffffff] uppercase md:text-8xl"
		>
			Drop it like it's hot
		</div>
	</div>
	<label class="sr-only" for="dropzone">{m.gross_nice_gecko_compose()}</label>
	<input
		id="dropzone"
		class="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
		type="file"
		{multiple}
		{accept}
		{disabled}
		onchange={handleChange}
	/>
</div>
