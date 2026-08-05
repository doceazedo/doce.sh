<script lang="ts">
	import PageTitle from "$lib/components/common/page-title.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { Heart3FillHealthMedical } from "svelte-remix";
	import type { GalleryAlbum } from "$lib/immich-types";
	import { Button } from "$lib/components/ui/button";
	import { getLocale } from "$lib/paraglide/runtime";
	import { m } from "$lib/paraglide/messages";
	import { cn } from "$lib/utils";

	const TOP = "group-hover:translate-y-0";
	const BOTTOM = "group-hover:translate-y-10";
	const LEFT_18 = "group-hover:-translate-x-18";
	const LEFT_20 = "group-hover:-translate-x-20";
	const RIGHT_18 = "group-hover:translate-x-18";
	const RIGHT_20 = "group-hover:translate-x-20";

	const VARIANTS = [
		{
			main: "group-hover:-rotate-2",
			first: `${RIGHT_18} ${BOTTOM}`,
			second: `${LEFT_18} ${TOP}`,
		},
		{
			main: "group-hover:rotate-2",
			first: `${RIGHT_20} ${TOP}`,
			second: `${LEFT_18} ${BOTTOM}`,
		},
		{
			main: "group-hover:-rotate-2",
			first: `${RIGHT_20} ${BOTTOM}`,
			second: `${LEFT_20} ${TOP}`,
		},
		{
			main: "group-hover:rotate-2",
			first: `${RIGHT_18} ${TOP}`,
			second: `${LEFT_20} ${BOTTOM}`,
		},
		{
			main: "group-hover:-rotate-2",
			first: `${LEFT_18} ${TOP}`,
			second: `${RIGHT_18} ${BOTTOM}`,
		},
		{
			main: "group-hover:rotate-2",
			first: `${LEFT_20} ${BOTTOM}`,
			second: `${RIGHT_18} ${TOP}`,
		},
		{
			main: "group-hover:-rotate-2",
			first: `${LEFT_20} ${TOP}`,
			second: `${RIGHT_20} ${BOTTOM}`,
		},
		{
			main: "group-hover:rotate-2",
			first: `${LEFT_18} ${BOTTOM}`,
			second: `${RIGHT_20} ${TOP}`,
		},
	];

	const getAlbums = async () => {
		try {
			const resp = await fetch("/api/gallery");
			const data = await resp.json();
			return (data.albums as GalleryAlbum[]).map((album) => ({
				...album,
				variant: VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
			}));
		} catch (_error) {
			return [];
		}
	};
</script>

<Seo title={m.gallery_seo_title()} />

<div class="flex flex-col gap-6 md:gap-12">
	<PageTitle title={m.gallery()} subtitle={m.gallery_subtitle()} />
	<ul
		class="group/albums grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-14 lg:grid-cols-3"
	>
		{#await getAlbums()}
			{#each Array(6) as _}
				<Skeleton class="aspect-square w-full rounded" />
			{/each}
		{:then albums}
			{#each albums as album}
				{@const isFavorites = album.id === "favorites"}
				<Button
					href="/gallery/{album.id}"
					variant="ghost"
					class="group relative h-fit flex-col p-0 group-has-hover/albums:not-hover:opacity-50 hover:bg-transparent!"
				>
					{#each album.previewThumbnailUrls as href, thumbIdx}
						<figure
							class={cn(
								"bg-muted ease-elastic absolute top-0 aspect-square w-1/2 overflow-hidden rounded shadow-lg transition-all duration-300 before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15",
								thumbIdx == 0
									? "-translate-y-4 group-hover:scale-125 group-hover:rotate-1"
									: "translate-y-2 scale-125 group-hover:-rotate-2",
								thumbIdx == 0 ? album.variant.first : album.variant.second,
							)}
						>
							<img src={href} alt="" class="size-full object-cover" />
						</figure>
					{/each}
					<figure
						class={cn(
							"bg-muted ease-elastic relative aspect-square w-3/4 overflow-hidden rounded shadow-md transition-all duration-300 before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15",
							album.variant.main,
						)}
					>
						<img
							src={album.thumbnailUrl}
							alt=""
							class="size-full object-cover"
						/>
						{#if isFavorites}
							<Heart3FillHealthMedical
								class="text-primary absolute top-2 right-2 size-6"
							/>
						{/if}
					</figure>
					<hgroup class="text-center">
						<p class="text-foreground -mb-1.5 text-xl">
							{isFavorites ? m.favorites() : album.title}
						</p>
						<p class="inline-flex gap-1.5 text-sm font-normal">
							{#if !isFavorites}
								{new Date(album.startDate).toLocaleDateString(getLocale(), {
									month: "long",
									year: "numeric",
								})} <span class="opacity-50">&bull;</span>
							{/if}
							{album.count === 1
								? m["1_photo"]()
								: m.x_photos({ count: album.count })}
						</p>
					</hgroup>
				</Button>
			{/each}
		{/await}
	</ul>
</div>
