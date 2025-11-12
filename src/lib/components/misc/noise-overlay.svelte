<script lang="ts">
	import { NOISE_SETTING } from "$lib/settings";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";

	const SPRITES = 4;

	let active = $state(0);

	const updateNoise = () => {
		if ($NOISE_SETTING !== "animated") return;
		if (active + 1 >= SPRITES) {
			active = 0;
		} else {
			active += 1;
		}
	};

	onMount(() => {
		const lastPlayedInterval = setInterval(updateNoise, 200 / SPRITES);
		return () => clearInterval(lastPlayedInterval);
	});
</script>

{#if $NOISE_SETTING !== "off"}
	{#each Array(SPRITES).fill(null) as _uwu, i}
		<div
			class={cn(
				"pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-60 opacity-0 invert-100 dark:invert-0",
				active === i && "opacity-4 dark:opacity-8",
			)}
			style="image-rendering: pixelated; background-image:url(/img/noise-{i +
				1}.webp)"
			aria-hidden="true"
		></div>
	{/each}
{/if}
