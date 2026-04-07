<script lang="ts">
	import { VerifyEmailPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<VerifyEmailPage verificationForm={data.verificationForm} resendForm={data.resendForm} />
