<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import { cn } from "$lib/utils";
	import { CopperCoinLineFinance } from "svelte-remix";
	import Button from "$lib/components/ui/button/button.svelte";
	import { scale } from "svelte/transition";
	import {
		GAME_DATA,
		GAME_STATE,
		IS_GUMBALL_LOADED,
		PRIZE_ITEM,
	} from "../stores";
	import { RARITIES } from "../constants";
	import GumballSkeleton from "$lib/components/icons/gumball-skeleton.svg?component";
	import { m } from "$lib/paraglide/messages";
	import { Canvas } from "@threlte/core";
	import { WebGLRenderer } from "three";
	import PlayScene from "../scenes/play-scene.svelte";
	import Sunburst from "$lib/components/icons/sunburst.svg?component";
	import { onMount } from "svelte";

	let playScene = $state<PlayScene>();

	let prizeRarity = $derived(
		RARITIES.find((x) => x.id === $PRIZE_ITEM?.rarity) || RARITIES[0],
	);

	const claimReward = () => ($GAME_STATE = "idle");

	let isTransitionDone = $state(false);
	onMount(() => {
		setTimeout(() => {
			isTransitionDone = true;
		}, 200);
	});
</script>

<div class="relative flex flex-col w-full flex-1 min-h-0 overflow-hidden">
	<div class="z-30 flex flex-col w-full flex-1 min-h-0 items-center justify-center">
	<div class="relative w-full flex-1 min-h-0">
		{#if isTransitionDone}
			<div class="absolute inset-0">
				<Canvas
					createRenderer={(canvas) => {
						return new WebGLRenderer({
							canvas,
							alpha: true,
							preserveDrawingBuffer: true,
						});
					}}
					shadows
				>
					<PlayScene bind:this={playScene} />
				</Canvas>
			</div>
		{/if}

		{#if !isTransitionDone || !$IS_GUMBALL_LOADED}
			<div
				class="pointer-events-none absolute inset-0 flex items-center justify-center"
			>
				<GumballSkeleton class="text-muted/50 h-[22rem] animate-pulse" />
			</div>
		{/if}
	</div>

	<footer class="flex h-12 shrink-0">
		{#if $GAME_STATE === "idle"}
			<div
				transition:scale={{
					easing: cubicOut,
					opacity: 0,
					start: 0.9,
					duration: 200,
				}}
				class="flex gap-3"
			>
				<Button
					size="lg"
					class="h-12"
					onclick={() => playScene?.dispense()}
					disabled={$GAME_DATA.balance < 100}
				>
					<div class="flex items-center gap-1">
						<CopperCoinLineFinance class="size-5" />
						<span class={cn($GAME_DATA.balance < 100 && "text-red-800")}>100</span
						>
					</div>
					<hr class="bg-primary-foreground/20 h-1/2 w-px" />
					{m.dispense_now()}
				</Button>
			</div>
		{/if}

		{#if $GAME_STATE === "prize"}
			<div
				transition:scale={{
					easing: cubicOut,
					opacity: 0,
					start: 0.9,
					duration: 200,
				}}
				class="flex"
			>
				<Button variant="outline" onclick={claimReward}>{m.claim()}</Button>
			</div>
		{/if}
	</footer>
</div>

<div
	class={cn(
		"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-[24rem] scale-200 items-center justify-center opacity-15 transition-all lg:scale-400 pointer-events-none",
		$GAME_STATE !== "prize" && "scale-50 opacity-0",
	)}
>
	<div class="size-[24rem] overflow-hidden">
		<Sunburst
			class={cn("animation-duration-10000 animate-spin", prizeRarity.textColor)}
		/>
	</div>
	<div
		class="from-background/80 to-background absolute size-full bg-radial to-50%"
	></div>
</div>
<div
	class={cn(
		"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-2xl rounded-full opacity-15 blur-3xl transition-all dark:opacity-5",
		$GAME_STATE === "prize" ? prizeRarity.bgColor : "bg-primary",
	)}
></div>

<hgroup
	class={cn(
		"ease-elastic absolute top-12 left-1/2 -translate-x-1/2 text-center transition-all",
		$GAME_STATE !== "prize" && "scale-50 opacity-0",
	)}
>
	<span
		class={cn(
			"rounded px-1 text-sm font-medium",
			prizeRarity.textColor,
			prizeRarity.badgeColor,
		)}
	>
		{prizeRarity.label}
	</span>
	<h1 class="text-xl md:text-2xl">
		{$PRIZE_ITEM?.label}
	</h1>
</hgroup>
</div>
