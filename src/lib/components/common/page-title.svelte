<script lang="ts">
	let {
		title,
		subtitle,
	}: {
		title: string;
		subtitle?: string;
	} = $props();
</script>

<hgroup class="py-3 md:py-6">
	<h1 class="text-4xl lg:text-6xl/18">{title}</h1>
	{#if subtitle}
		<p
			class="text-body [&>a]:hover:text-primary [&>a]:text-foreground lg:text-xl [&>a]:underline [&>a]:transition-all"
		>
			{@html subtitle}
		</p>
	{/if}
</hgroup>
