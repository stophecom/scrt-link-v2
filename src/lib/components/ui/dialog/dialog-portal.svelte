<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = DialogPrimitive.PortalProps;
</script>

<DialogPrimitive.Portal {...$$restProps}>
	<slot />
</DialogPrimitive.Portal>
