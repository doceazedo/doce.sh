<script lang="ts">
	import { CopperCoinLineFinance } from "svelte-remix";
	import { cn } from "$lib/utils";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import {
		ACTIVE_TAB,
		GAME_STATE,
		IS_INVENTORY_BALANCE_VISIBLE,
		TWEENED_BALANCE,
	} from "../stores";
	import { getLocale } from "$lib/paraglide/runtime";

	let isFeaturingPrize = $derived($GAME_STATE === "prize");
	let isInventoryOpen = $derived($ACTIVE_TAB === "inventory");
</script>

{#if !isInventoryOpen ? !isFeaturingPrize : !$IS_INVENTORY_BALANCE_VISIBLE}
	<div
		transition:fly={{
			easing: cubicOut,
			opacity: 0,
			y: -12,
			duration: 200,
		}}
		class={cn(
			"bg-background flex items-center gap-1.5 rounded border px-3 py-1.5 w-fit absolute top-32",
			$ACTIVE_TAB !== "play" &&
				"w-full justify-center rounded-none border-0 border-b lg:w-fit lg:rounded lg:border",
		)}
	>
		<CopperCoinLineFinance class="size-5 text-amber-500" />
		{Math.floor(TWEENED_BALANCE.current).toLocaleString(getLocale())}
	</div>
{/if}
