<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { fade } from "svelte/transition";
	import { PIGGYBANK, TABS } from "../constants";
	import { ACTIVE_TAB, GAME_DATA, GAME_STATE } from "../stores";

	let hasAvailableRewards = $derived(
		(() => {
			const nextClaimDate = new Date($GAME_DATA.dailyRewards.startedAt);
			nextClaimDate.setDate(
				nextClaimDate.getDate() + $GAME_DATA.dailyRewards.streak + 1,
			);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const canClaimDailyReward = nextClaimDate.getTime() === today.getTime();
			const isPiggybankFull = $GAME_DATA.piggybank.balance >= PIGGYBANK.max;
			return canClaimDailyReward || isPiggybankFull;
		})(),
	);
</script>

{#each TABS as tab}
	{@const isActive = $ACTIVE_TAB === tab.id}
	{@const Icon = isActive ? tab.iconActive : tab.icon}
	<Button
		variant="ghost"
		class={cn(
			"h-auto flex-col gap-0.5 rounded-none py-4 text-sm transition-all md:size-[97px] md:border-b md:border-b-transparent md:bg-linear-to-t!",
			isActive &&
				"text-primary! md:border-b-primary bg-primary/10! md:border-primary/40! md:bg-transparent! md:from-primary/10! md:to-primary/0!",
		)}
		onclick={() => ($ACTIVE_TAB = tab.id)}
		disabled={$GAME_STATE !== "idle"}
	>
		<span class="relative size-5">
			{#key isActive}
				<span class="absolute flex" transition:fade={{ duration: 100 }}>
					<Icon class={cn("text-body size-5", isActive && "text-primary")} />
				</span>
			{/key}
		</span>
		<p class="flex items-center gap-1.5">
			{tab.label}
			{#if tab.id === "rewards" && hasAvailableRewards}
				<span
					class="bg-primary relative mt-px flex size-1.5 shrink-0 items-center justify-center rounded-full"
				>
					<span class="bg-primary absolute size-1.5 animate-ping rounded-full"
					></span>
				</span>
			{/if}
		</p>
	</Button>
{/each}
