<script lang="ts">
	import { cn } from "$lib/utils";

	let {
		title,
		subtitle,
		class: className,
	}: {
		title: string;
		subtitle?: string;
		class?: string
	} = $props();
</script>

<hgroup class={cn("pt-6 md:pt-0", className)}>
	<h1 class="text-4xl lg:text-6xl/18">{title}</h1>
	{#if subtitle}
		<p
			class="text-body [&>a]:hover:text-primary [&>a]:text-foreground lg:text-xl [&>a]:underline [&>a]:transition-all"
		>
			{@html subtitle}
		</p>
	{/if}
</hgroup>
