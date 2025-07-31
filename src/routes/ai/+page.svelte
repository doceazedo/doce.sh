<script lang="ts">
	import Prose from "$lib/components/common/prose.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
</script>

<Seo title="{m.ai_usage()} • Doce Fernandes" />

<hgroup class="mb-3 py-3 md:mb-6 md:py-6">
	<h1 class="text-3xl md:text-4xl">{m.ai_usage()}</h1>
	<p
		class="text-body [&>a]:text-foreground [&>a]:hover:text-primary [&>a]:underline [&>a]:transition-all"
	>
		{@html m.ai_usage_subtitle()}
	</p>
</hgroup>

<Prose>
	{@html m.ai_usage_description()}
</Prose>
