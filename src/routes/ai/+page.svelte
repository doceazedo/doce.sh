<script lang="ts">
	import PageTitle from "$lib/components/common/page-title.svelte";
	import Prose from "$lib/components/common/prose.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
</script>

<Seo title="{m.ai_usage()} • Doce Fernandes" />

<div class="flex flex-col gap-12">
	<PageTitle class="text-center" title={m.ai_usage()} subtitle={m.ai_usage_subtitle()} />
	<Prose class="max-w-2xl mx-auto border p-6 rounded">
		{@html m.ai_usage_description()}
	</Prose>
</div>
