<script lang="ts" generics="T">
	import type { Component, Snippet } from "svelte";
	import { browser } from "$app/environment";
	import { ArrowRightLineArrows } from "svelte-remix";
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { IS_DESKTOP } from "$lib/stores";
	import { onVisible } from "$lib/utils/actions";
	import { elasticFly } from "$lib/utils/transitions";

	let {
		icon,
		title,
		subtitle,
		updatedAt,
		items,
		poster,
		link,
		details,
	}: {
		icon: Component;
		title: string;
		subtitle?: string;
		updatedAt?: Date | null;
		items: Promise<T[]>;
		poster: (item: T) => {
			id?: string;
			title: string;
			url?: string;
			image?: string;
		};
		link: { href: string; label: string };
		details: Snippet<[T]>;
	} = $props();

	let isVisible = $state(!browser);

	const handleMissingCoverArt = (event: Event) => {
		const img = event.target as HTMLImageElement;
		const placeholder = `https://placehold.co/600x900?text=${encodeURIComponent(img.alt)}`;
		if (img.src === placeholder) return;
		img.src = placeholder;
	};
</script>

<SectionTitleWithIcon {icon} {title} {subtitle} {updatedAt} />
<div
	class="flex flex-col gap-3 md:gap-6"
	use:onVisible={() => (isVisible = true)}
>
	<div class="grid grid-cols-3 gap-3 md:grid-cols-5 lg:gap-6">
		{#await items}
			{#each Array(5).fill(null) as _uwu}
				<Skeleton class="aspect-[6/9] rounded" />
			{/each}
		{:then items}
			{#if isVisible}
				{#each items as item, i (i)}
					{@const { id, title, url, image } = poster(item)}
					{#if i !== 5 || !$IS_DESKTOP}
						<Tooltip.Provider delayDuration={300}>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										class="bg-muted ease-elastic relative flex aspect-[6/9] rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-105 lg:hover:scale-115"
										in:elasticFly|global={{
											opacity: 0,
											y: 12,
											duration: 800,
											delay: 50 * (i + 1),
										}}
									>
										<img
											src={image}
											alt={title}
											class="size-full rounded object-cover"
											data-id={id}
											onerror={handleMissingCoverArt}
										/>
									</a>
								</Tooltip.Trigger>
								<Tooltip.Content side="bottom" class="justify-center">
									<p class="mx-auto mb-0.5 max-w-[20ch] text-center leading-5">
										{title}
									</p>
									{@render details(item)}
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/if}
				{/each}
			{/if}
		{/await}
	</div>
	<Button
		href={link.href}
		target="_blank"
		variant="link"
		class="w-fit md:ml-auto"
	>
		{link.label}
		<ArrowRightLineArrows class="size-5" />
	</Button>
</div>
