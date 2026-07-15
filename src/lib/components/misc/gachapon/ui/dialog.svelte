<script lang="ts">
	import { elasticScale } from "$lib/utils/transitions";
	import { elasticOut } from "svelte/easing";
	import Tabs from "./tabs.svelte";
	import Balance from "./balance.svelte";
	import { ACTIVE_TAB } from "../stores";
	import { initializeGame } from "../game";
	import { onMount } from "svelte";
	import { TABS } from "../constants";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import { m } from "$lib/paraglide/messages";
	import { cn } from "$lib/utils";

	onMount(initializeGame);
</script>

<div
	class={cn("flex flex-col items-center mt-6 md:mt-0 relative gap-6", $ACTIVE_TAB == "play" && " h-[calc(100dvh-6rem)] min-h-[36rem]")}
>
	<div class="flex w-full items-center border-b pb-6">
		<PageTitle title={m.portfolio_gachapon_pretitle()} />
	</div>

	<Balance />

	{#key $ACTIVE_TAB}
		{@const view = TABS.find((x) => x.id === $ACTIVE_TAB)}
		{#if view}
			<div
				class="flex flex-col w-[calc(100%+3rem)] max-h-[calc(100dvh-300px)] md:w-full md:max-h-none flex-1 min-h-0"
				in:elasticScale|global={{
					easing: elasticOut,
					start: 0.9,
					duration: 8000,
				}}
			>
				<view.content />
			</div>
		{/if}
	{/key}

	<navbar
		class="grid grid-cols-3 p-0 border-t w-[calc(100%+3rem)] md:absolute md:top-0 md:right-0 md:flex md:flex-row md:justify-center md:gap-0 md:border-t-0 md:p-0 md:w-fit"
	>
		<Tabs />
	</navbar>
</div>
