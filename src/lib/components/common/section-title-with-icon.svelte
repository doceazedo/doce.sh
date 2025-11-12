<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import { timeAgo } from "$lib/utils/date";
	import type { Component } from "svelte";
	import { CalendarCheckLineBusiness } from "svelte-remix";
	import { Skeleton } from "$lib/components/ui/skeleton";

	let {
		icon: Icon,
		title,
		subtitle,
		updatedAt,
	}: {
		icon: Component;
		title: string;
		subtitle?: string;
		updatedAt?: Date | null;
	} = $props();
</script>

<div class="flex gap-3 lg:gap-6 xl:-ml-[4.5rem]">
	<div
		class="bg-primary/20 border-primary flex size-8 shrink-0 items-center justify-center rounded border lg:size-12"
	>
		<Icon class="text-primary size-5 lg:size-7" />
	</div>
	<hgroup>
		<h2 class="-mt-0.5 text-3xl md:text-4xl lg:mt-1">{title}</h2>
		{#if subtitle}
			<p class="text-body text-lg">{subtitle}</p>
		{/if}
		{#if updatedAt !== undefined}
			<p class="text-body mt-1.5 flex items-center gap-1.5 text-sm">
				<CalendarCheckLineBusiness class="text-foreground size-4" />
				<span class="[&>span]:text-foreground flex items-center gap-0.75">
					{@html m.updated_at({
						date: updatedAt ? timeAgo(updatedAt) : "",
					})}
					{#if !updatedAt}
						<Skeleton class="h-4 w-16 rounded" />
					{/if}
				</span>
			</p>
		{/if}
	</hgroup>
</div>
