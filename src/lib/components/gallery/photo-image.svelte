<script lang="ts">
	import type { GalleryPhoto } from "$lib/immich-types";
	import { cn } from "$lib/utils";
	import { thumbhashToDataUrl } from "$lib/utils/thumbhash";

	let {
		photo,
		thumbnail = false,
		loading = "eager",
		class: className,
	}: {
		photo: GalleryPhoto;
		thumbnail?: boolean;
		loading?: "eager" | "lazy";
		class?: string;
	} = $props();

	let img = $state<HTMLImageElement | null>(null);
	let loaded = $state(false);

	const src = $derived(thumbnail ? photo.thumbnailUrl : photo.url);
	const placeholder = $derived(
		thumbhashToDataUrl(photo.thumbhash, photo.width, photo.height),
	);

	$effect(() => {
		void src;
		loaded = img?.complete ?? false;
	});
</script>

{#if placeholder}
	<img
		src={placeholder}
		alt=""
		aria-hidden="true"
		class={cn(
			"absolute inset-0 size-full transition-opacity duration-500",
			loaded && "opacity-0",
			className,
		)}
	/>
{/if}
<img
	bind:this={img}
	{src}
	alt={photo.exif?.description || ""}
	{loading}
	decoding="async"
	onload={() => (loaded = true)}
	class={cn(
		"absolute inset-0 size-full transition-opacity duration-500",
		!loaded && "opacity-0",
		className,
	)}
/>
