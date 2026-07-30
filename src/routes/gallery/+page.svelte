<script lang="ts">
	import { browser } from "$app/environment";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { m } from "$lib/paraglide/messages";
	import { postedAt, wasPostedThisWeek } from "$lib/utils/date";
	import { elasticFly } from "$lib/utils/transitions.js";
	import { onMount } from "svelte";
	import { Heart3FillHealthMedical, StarFillSystem } from "svelte-remix";
	import type { GalleryAlbum } from "$lib/immich-types";
	import { Button } from "$lib/components/ui/button";
	import { getLocale } from "$lib/paraglide/runtime";

	let mounted = $state(!browser);
	onMount(() => (mounted = true));

	const getAlbums = async () => {
		try {
			const resp = await fetch("/api/gallery");
			const data = await resp.json();
			return data.albums as GalleryAlbum[];
		} catch (_error) {
			return [];
		}
	};
</script>

<Seo title="Doce's camera roll" />

<div class="flex flex-col gap-6 md:gap-12">
	<PageTitle title="Gallery" subtitle="Some of the photos I've taken." />
	<ul class="grid grid-cols-2 gap-3 lg:grid-cols-3">
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
					class="h-fit flex-col items-start p-3"
				>
					<figure
						class="bg-muted relative aspect-square w-full overflow-hidden rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15"
					>
						<img
							src={album.thumbnailUrl}
							alt=""
							class="size-full object-cover"
						/>
						{#if isFavorites}
							<Heart3FillHealthMedical
								class="text-primary absolute top-3 right-3 size-6"
							/>
						{/if}
					</figure>
					<hgroup class="text-left">
						<p class="text-foreground text-xl">{album.title}</p>
						<p class="inline-flex gap-1.5 font-normal">
							{new Date(album.startDate).toLocaleDateString(getLocale(), {
								month: "long",
								year: "numeric",
							})} <span class="opacity-50">&bull;</span>
							{album.count} photos
						</p>
					</hgroup>
				</Button>
			{/each}
		{/await}
	</ul>
</div>
