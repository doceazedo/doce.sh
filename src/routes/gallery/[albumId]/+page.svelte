<script lang="ts">
	import Seo from "$lib/components/common/seo.svelte";
	import { fullDate } from "$lib/utils/date.js";
	import { getLocalizedTextLine } from "$lib/utils/locale";
	import { m } from "$lib/paraglide/messages";
	import { CalendarLineBusiness, MultiImageLineMedia } from "svelte-remix";
	import justifiedLayout from "justified-layout";
	import Prose from "$lib/components/common/prose.svelte";
	import Lightbox from "$lib/components/gallery/lightbox.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	let { data } = $props();

	const isFavorites = $derived(data.album.id === "favorites");
	const title = $derived(isFavorites ? m.favorites() : data.album.title);

	let containerWidth = $state(0);

	const openPhotoId = $derived(page.url.searchParams.get("photo"));
	const openPhotoIndex = $derived(
		data.album.items.findIndex((photo) => photo.id === openPhotoId),
	);

	const photoHref = (photoId: string) =>
		`${page.url.pathname}?photo=${photoId}`;

	const selectPhoto = (index: number) => {
		const photo = data.album.items[index];
		if (!photo) return;
		goto(photoHref(photo.id), { noScroll: true, keepFocus: true });
	};

	const closeLightbox = () =>
		goto(page.url.pathname, { noScroll: true, keepFocus: true });

	const targetRowHeight = $derived(containerWidth < 640 ? 320 : 480);

	const layout = $derived(
		containerWidth
			? justifiedLayout(
					data.album.items.map((photo) => ({
						width: photo.width || 1,
						height: photo.height || 1,
					})),
					{
						containerWidth,
						targetRowHeight,
						containerPadding: 0,
						boxSpacing: 12,
					},
				)
			: null,
	);
</script>

<Seo title={m.gallery_album_seo_title({ title })} />

<div class="flex flex-col gap-6">
	<header class="mt-6 flex flex-col gap-1.5 md:mt-0">
		<h1 class="text-3xl lg:text-4xl">
			{title}
		</h1>
		<div class="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
			<div class="text-body flex items-center gap-1.5">
				<CalendarLineBusiness class="size-4" />
				<p class="[&>span]:text-foreground">
					{fullDate(new Date(data.album.startDate))}
					{#if data.album.endDate && data.album.endDate !== data.album.startDate}
						- {fullDate(new Date(data.album.endDate))}
					{/if}
				</p>
			</div>
			<span class="text-body/70 hidden md:block">&bull;</span>
			<div class="text-body flex items-center gap-1.5">
				<MultiImageLineMedia class="size-4" />
				<p class="[&>span]:text-foreground">
					{data.album.count === 1
						? m["1_photo"]()
						: m.x_photos({ count: data.album.count })}
				</p>
			</div>
		</div>
	</header>
	<hr />
	{#if data.album.description}
		<Prose>
			{getLocalizedTextLine(data.album.description)}
		</Prose>
	{/if}
	<ul
		bind:clientWidth={containerWidth}
		class="relative w-full"
		style:height={layout ? `${layout.containerHeight}px` : undefined}
	>
		{#each data.album.items as photo, i (photo.id)}
			{@const box = layout?.boxes[i]}
			{#if box}
				<li
					class="bg-muted ease-elastic absolute overflow-hidden rounded transition-all before:pointer-events-none before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-101"
					style:top="{box.top}px"
					style:left="{box.left}px"
					style:width="{box.width}px"
					style:height="{box.height}px"
				>
					<a
						href={photoHref(photo.id)}
						data-sveltekit-noscroll
						class="block size-full"
					>
						<img
							src={photo.url}
							alt={photo.exif?.description || ""}
							loading="lazy"
							decoding="async"
							class="size-full object-cover"
						/>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</div>

{#if openPhotoIndex >= 0}
	<Lightbox
		photos={data.album.items}
		index={openPhotoIndex}
		onclose={closeLightbox}
		onselect={selectPhoto}
	/>
{/if}
