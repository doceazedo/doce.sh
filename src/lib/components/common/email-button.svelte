<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import { Button } from "$lib/components/ui/button";
	import { EMAIL } from "$lib/constants";
	import {
		CheckLineSystem,
		FileCopyLineDocument,
		MailLineBusiness,
	} from "svelte-remix";
	import { toast } from "svelte-sonner";
	import { elasticFly } from "$lib/utils/transitions";
	import { cn } from "$lib/utils";

	let copied = $state(false);
	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(EMAIL);
			toast.success(m.copy_success());

			if (copied) return;
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch (err) {
			toast.error(m.copy_error());
		}
	};

	let { class: className }: { class?: string } = $props();
</script>

<div class="flex gap-3">
	<span
		class="flex w-full"
		in:elasticFly|global={{
			opacity: 0,
			y: 12,
			duration: 800,
		}}
	>
		<Button
			href="mailto:{EMAIL}"
			variant="outline"
			size="lg"
			class={cn("grow", className)}
		>
			<MailLineBusiness class="size-5" />
			{EMAIL}
		</Button>
	</span>
	<span
		in:elasticFly|global={{
			opacity: 0,
			y: 12,
			duration: 800,
			delay: 50,
		}}
	>
		<Button variant="secondary" size="lg" onclick={copyEmail}>
			{#if copied}
				<CheckLineSystem class="size-5" />
			{:else}
				<FileCopyLineDocument class="size-5" />
			{/if}
			{m.copy()}
		</Button>
	</span>
</div>
