<script lang="ts">
	import { MEMOJI_BLINK_COUNT } from "$lib/stores";
	import { cn } from "$lib/utils";
	import { prefersReducedMotion } from "svelte/motion";

	let {
		class: className = "",
		variant = "halfbody",
	}: { class?: string; variant?: "halfbody" | "fullbody" } = $props();

	let isHovering = $state(false);

	const isHalfBody = $derived(variant == "halfbody");
	const src = $derived.by(() => {
		const wantStatic = prefersReducedMotion.current && !isHovering;
		if (isHalfBody) {
			return wantStatic
				? "/img/doce-mii-halfbody-static.webp"
				: "/img/doce-mii-halfbody-128.webp";
		}
		return wantStatic
			? "/img/doce-mii-fullbody-static.webp"
			: "/img/doce-mii-fullbody-128.webp";
	});
</script>

<img
	{src}
	alt=""
	class={cn(
		"-ml-1.5 transition-all hover:scale-110",
		isHalfBody ? "size-10" : "w-20",
		className,
	)}
	onmouseenter={() => {
		isHovering = true;
		// $MEMOJI_BLINK_COUNT += 1;
	}}
	onmouseleave={() => (isHovering = false)}
/>
