<script lang="ts">
	import { ResetPasswordPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ResetPasswordPage form={data.resetPasswordForm} />
