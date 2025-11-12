<script lang="ts">
	let {
		title,
		subtitle,
	}: {
		title: string;
		subtitle?: string;
	} = $props();
</script>

<hgroup class="text-foreground">
	<h1 class="text-3xl md:text-4xl">{title}</h1>
	{#if subtitle}
		<p class="text-body lg:text-xl">{subtitle}</p>
	{/if}
</hgroup>
