<script lang="ts">
	import { cn } from "$lib/utils";
	import { mode } from "mode-watcher";
	import { onMount } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	let { mode: _mode }: { mode: "dark" | "light" } = $props();

	let isDayTime = $state(false);

	onMount(() => {
		const hour = new Date().getHours();
		isDayTime = hour >= 7 && hour <= 17;
	});
</script>

{#if mode.current === _mode}
	<div
		class="pointer-none absolute -top-52 -right-96 hidden lg:block"
		in:fade={{ easing: cubicOut, duration: 800, delay: 600 }}
		out:fade={{ easing: cubicOut, duration: 100 }}
	>
		<div class="relative -z-20 grid grid-cols-12">
			{#each Array(12 * 9).fill(null) as _uwu}
				<div
					class={cn(
						"size-24 border-t border-r opacity-40 transition-all dark:opacity-80",
					)}
				></div>
			{/each}
		</div>
		<div
			class={cn(
				"absolute top-0 -z-10 h-full w-48 bg-linear-to-l",
				_mode === "dark" && "from-[#0c0911]/0 to-[#0c0911]",
				_mode === "light" && "from-white/0 to-white",
			)}
		></div>
		<div
			class={cn(
				"absolute top-0 right-0 -z-10 h-full w-48 bg-linear-to-r",
				_mode === "dark" && "from-[#0c0911]/0 to-[#0c0911]",
				_mode === "light" && "from-white/0 to-white",
			)}
		></div>
		<div
			class={cn(
				"absolute bottom-0 -z-10 h-48 w-full bg-linear-to-b",
				_mode === "dark" && "from-[#0c0911]/0 to-[#0c0911]",
				_mode === "light" && "from-white/0 to-white",
			)}
		></div>
	</div>
{/if}
