<script lang="ts">
	import type { GalleryPhoto } from "$lib/immich-types";
	import { Button } from "$lib/components/ui/button";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import { SHOW_PHOTO_INFO } from "$lib/settings";
	import { fullDate } from "$lib/utils/date";
	import {
		ArrowLeftLineArrows,
		ArrowRightLineArrows,
		CalendarLineBusiness,
		Camera3LineMedia,
		Camera4LineMedia,
		CameraLensFillMedia,
		CloseLineSystem,
		InformationLineSystem,
		MapPinLineMap,
		SidebarUnfoldLineSystem,
	} from "svelte-remix";
	import type { Component } from "svelte";
	import { cn } from "$lib/utils";

	const SWIPE_THRESHOLD = 50;

	let {
		photos,
		index,
		onclose,
		onselect,
	}: {
		photos: GalleryPhoto[];
		index: number;
		onclose: () => void;
		onselect: (index: number) => void;
	} = $props();

	let dialog = $state<HTMLDivElement | null>(null);
	let touchStartX = 0;
	let touchStartY = 0;

	const photo = $derived(photos[index]);
	const hasPrev = $derived(index > 0);
	const hasNext = $derived(index < photos.length - 1);
	const counter = $derived(
		m.photo_x_of_y({ current: index + 1, total: photos.length }),
	);

	const metadata = $derived.by(() => {
		const exif = photo.exif ?? {};
		const takenAt = new Date(photo.takenAt);
		const rows: { label: string; value: string | null; icon?: Component }[] = [
			{
				label: m.date_taken(),
				value: m.date_time({
					date: fullDate(takenAt),
					time: takenAt.toLocaleTimeString(getLocale(), {
						hour: "2-digit",
						minute: "2-digit",
					}),
				}),
				icon: CalendarLineBusiness,
			},
			{
				label: m.camera(),
				value: [exif.make, exif.model].filter(Boolean).join(" "),
				icon: Camera3LineMedia,
			},
			{
				label: m.aperture(),
				value: exif.fNumber ? `ƒ/${exif.fNumber}` : null,
				icon: CameraLensFillMedia,
			},
			{
				label: m.focal_length(),
				value: exif.focalLength ? `${exif.focalLength}mm` : null,
			},
			{
				label: m.shutter_speed(),
				value: exif.exposureTime ? `${exif.exposureTime}s` : null,
				icon: Camera4LineMedia,
			},
			{
				label: m.iso(),
				value: exif.iso ? `${exif.iso}` : null,
			},
			{
				label: m.location(),
				value: [exif.city, exif.state, exif.country].filter(Boolean).join(", "),
				icon: MapPinLineMap,
			},
		];
		return rows.filter((row) => !!row.value);
	});

	const goPrev = () => hasPrev && onselect(index - 1);
	const goNext = () => hasNext && onselect(index + 1);

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			onclose();
		} else if (event.key === "ArrowLeft") {
			goPrev();
		} else if (event.key === "ArrowRight") {
			goNext();
		} else {
			return;
		}
		event.preventDefault();
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.changedTouches[0].clientX;
		touchStartY = event.changedTouches[0].clientY;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		const deltaX = event.changedTouches[0].clientX - touchStartX;
		const deltaY = event.changedTouches[0].clientY - touchStartY;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
		if (Math.abs(deltaX) < Math.abs(deltaY)) return;
		if (deltaX > 0) goPrev();
		else goNext();
	};

	$effect(() => {
		dialog?.focus();
	});

	$effect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	$effect(() => {
		for (const neighbor of [photos[index - 1], photos[index + 1]]) {
			if (neighbor) new Image().src = neighbor.url;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	bind:this={dialog}
	role="dialog"
	aria-modal="true"
	aria-label={counter}
	tabindex="-1"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	class="fixed inset-0 z-50 flex size-full flex-col bg-black outline-none md:flex-row"
>
	<div class="relative min-h-0 w-full flex-1">
		<Button
			size="iconLg"
			variant="ghost"
			onclick={onclose}
			aria-label={m.close()}
			class="absolute top-3 left-3 z-10"
		>
			<CloseLineSystem />
		</Button>
		{#if !$SHOW_PHOTO_INFO}
			<Button
				size="iconLg"
				variant="ghost"
				onclick={() => ($SHOW_PHOTO_INFO = true)}
				aria-label={m.photo_info()}
				class="absolute top-3 right-3 z-10"
			>
				<InformationLineSystem />
			</Button>
		{/if}
		{#if hasPrev}
			<Button
				size="iconLg"
				variant="ghost"
				onclick={goPrev}
				aria-label={m.previous_photo()}
				class="absolute top-1/2 left-3 z-10 -translate-y-1/2"
			>
				<ArrowLeftLineArrows />
			</Button>
		{/if}
		{#if hasNext}
			<Button
				size="iconLg"
				variant="ghost"
				onclick={goNext}
				aria-label={m.next_photo()}
				class="absolute top-1/2 right-3 z-10 -translate-y-1/2"
			>
				<ArrowRightLineArrows />
			</Button>
		{/if}
		<img
			src={photo.url}
			alt={photo.exif?.description || ""}
			class="size-full object-contain"
		/>
	</div>
	{#if $SHOW_PHOTO_INFO}
		<aside
			class="bg-background flex max-h-96 w-full shrink-0 flex-col gap-4 overflow-y-auto overscroll-contain border-t border-white/15 p-4 md:max-h-none md:w-sm md:border-t-0 md:border-l"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-xl lg:text-2xl">{m.photo_info()}</h2>
				<Button
					size="icon"
					variant="ghost"
					onclick={() => ($SHOW_PHOTO_INFO = false)}
				>
					<SidebarUnfoldLineSystem class="size-6" />
				</Button>
			</div>
			<hr />
			{#if photo.exif?.description}
				<p class="text-foreground/80">{photo.exif.description}</p>
			{/if}
			{#each metadata as data (data.label)}
				<div class="flex gap-3">
					{#if data.icon}
						<data.icon class="text-primary size-6" />
					{/if}
					<div class={cn(!data.icon && "-mt-3 ml-9")}>
						<p class="text-foreground/50 mt-0.5 text-sm">{data.label}</p>
						<p>{data.value}</p>
					</div>
				</div>
			{/each}
		</aside>
	{/if}
</div>
