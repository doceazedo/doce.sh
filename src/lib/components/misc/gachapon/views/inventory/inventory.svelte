<script lang="ts">
	import {
		ArchiveStackLineBusiness,
		CheckboxCircleFillSystem,
		CopperCoinLineFinance,
		FileCopyLineDocument,
		HistoryLineSystem,
		Progress5LineSystem,
		VipDiamondLineFinance,
	} from "svelte-remix";
	import { COLLECTIONS, ITEMS, RARITIES } from "../../constants";
	import { cn } from "$lib/utils";
	import {
		GAME_DATA,
		IS_INVENTORY_BALANCE_VISIBLE,
		ORDER_BY,
		TWEENED_BALANCE,
	} from "../../stores";
	import { getLocale } from "$lib/paraglide/runtime";
	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import { Label } from "$lib/components/ui/label";
	import { onMount, type Component } from "svelte";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import InventoryItem from "./inventory-item.svelte";
	import { m } from "$lib/paraglide/messages";
	import type { Item } from "../../types";

	type OrderBy = {
		value: string;
		label: string;
		icon: Component;
		orderedItems: {
			title: string;
			icon?: Component;
			iconColors?: {
				text: string;
				bg: string;
				border: string;
			};
			items: Item[];
		}[];
	};

	const orderOptions = $derived<OrderBy[]>([
		{
			value: "collection",
			label: m.collection(),
			icon: ArchiveStackLineBusiness,
			orderedItems: COLLECTIONS.map((collection) => ({
				title: collection.label,
				icon: collection.icon,
				items: ITEMS.filter((x) => x.collection === collection.id),
			})),
		},
		{
			value: "rarity",
			label: m.rarity(),
			icon: VipDiamondLineFinance,
			orderedItems: RARITIES.map((rarity) => ({
				title: rarity.label,
				icon: rarity.icon,
				iconColors: {
					text: rarity.textColor,
					bg: rarity.badgeColor,
					border: rarity.borderColor,
				},
				items: ITEMS.filter((x) => x.rarity === rarity.id),
			})),
		},
		{
			value: "recent",
			label: m.recent(),
			icon: HistoryLineSystem,
			orderedItems: [
				{
					title: m.order_by_recent_title(),
					items: $GAME_DATA.inventory
						.sort(
							(a, b) =>
								new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
						)
						.map((inv) => ITEMS.find((item) => item.id === inv.item))
						.filter((x) => !!x),
				},
			],
		},
		{
			value: "duplicate",
			label: m.duplicates(),
			icon: FileCopyLineDocument,
			orderedItems: [
				{
					title: m.order_by_duplicate_title(),
					items: $GAME_DATA.inventory
						.filter((x) => x.quantity > 1)
						.sort(
							(a, b) =>
								new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
						)
						.sort((a, b) => b.quantity - a.quantity)
						.map((inv) => ITEMS.find((item) => item.id === inv.item))
						.filter((x) => !!x),
				},
			],
		},
	]);

	let orderByOption = $derived(
		orderOptions.find((x) => x.value === $ORDER_BY) || orderOptions[0],
	);

	let scrollEl: HTMLElement;
	let balanceEl: HTMLElement;

	let viewItem: Item | null = $state(null);

	onMount(() => {
		// remove non-existing items
		$GAME_DATA.inventory = $GAME_DATA.inventory.filter((invItem) =>
			ITEMS.find((item) => item.id === invItem.item),
		);

		$IS_INVENTORY_BALANCE_VISIBLE = true;
	});

	const BALANCE_TOP_OFFSET = 96;
	const updateBalanceVisibilityStatus = () => {
		const rect = balanceEl.getBoundingClientRect();
		$IS_INVENTORY_BALANCE_VISIBLE = rect.top - BALANCE_TOP_OFFSET >= 0;
	};
</script>

<div
	class="relative flex size-full flex-col overflow-y-scroll lg:flex-row lg:overflow-y-hidden"
	onscroll={updateBalanceVisibilityStatus}
>
	<div
		class="pointer-events-none top-0 left-0 flex size-full flex-col gap-6 p-6 pb-0 md:gap-12 md:p-12 md:pb-0 lg:absolute lg:grid lg:grid-cols-12 lg:pb-12"
	>
		<aside class="pointer-events-auto col-span-4 flex flex-col items-center">
			<div
				class="bg-background z-10 flex aspect-square size-36 flex-col items-center justify-center rounded-full border p-12 text-center xl:size-44"
			>
				<p class="text-foreground mb-1.5 text-3xl font-semibold xl:text-4xl">
					{$GAME_DATA.inventory.reduce(
						(total, entry) => total + entry.quantity,
						0,
					)}
				</p>
				<p class="text-body mb-1.5 text-sm leading-3 xl:text-base xl:leading-4">
					{m.items_owned()}
				</p>
			</div>
			<div
				class="-mt-[4.5rem] mb-6 w-full rounded border pt-[4.5rem] lg:-mt-22 lg:pt-22"
			>
				<div
					class="mx-auto grid grid-cols-6 gap-x-3 gap-y-6 p-6 lg:w-2/3 lg:grid-cols-3 lg:px-0"
				>
					<div
						class="col-span-6 flex items-center justify-center gap-6 lg:col-span-3 lg:flex-col lg:gap-3 xl:flex-row xl:gap-6"
					>
						<div class="flex items-center gap-1.5" bind:this={balanceEl}>
							<CopperCoinLineFinance class="size-5 text-amber-500" />
							{Math.floor(TWEENED_BALANCE.current).toLocaleString(getLocale())}
						</div>
						<div class="flex items-center gap-1.5">
							{#if $GAME_DATA.inventory.length < ITEMS.length}
								<Progress5LineSystem class="text-body size-5" />
							{:else}
								<CheckboxCircleFillSystem class="text-primary size-5" />
							{/if}
							<p>
								{$GAME_DATA.inventory.length}
								<span class="text-body">/</span>
								{ITEMS.length}
							</p>
						</div>
					</div>
					{#each RARITIES as rarity}
						<div class="flex flex-col items-center gap-px">
							<rarity.icon class={cn("size-5", rarity.textColor)} />
							<p>
								{$GAME_DATA.inventory
									.filter(
										(item) =>
											ITEMS.find((itemData) => itemData.id === item.item)
												?.rarity === rarity.id,
									)
									.reduce((total, entry) => total + entry.quantity, 0)}
							</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="mb-6 flex w-full flex-col gap-1.5">
				<Label>{m.order_by()}</Label>
				<Select.Root
					type="single"
					bind:value={$ORDER_BY}
					onValueChange={() => scrollEl.scroll(0, 0)}
				>
					<Select.Trigger class="w-full">
						<div class="flex items-center gap-2">
							<orderByOption.icon />
							{orderByOption.label}
						</div>
					</Select.Trigger>
					<Select.Content>
						{#each orderOptions as option}
							<Select.Item value={option.value}>
								<option.icon />
								{option.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<hr class="mb-3 w-full md:mb-0 lg:hidden" />
		</aside>
		<main class="col-span-10 hidden w-full lg:flex"></main>
		<aside class="col-span-3 hidden size-full flex-col gap-6">
			<hgroup>
				<h2 class="text-foreground text-xl md:text-2xl">Reroll</h2>
				<div class="text-body text-sm leading-4">
					Destroy three items to be rerolled as a random new collectible.
				</div>
			</hgroup>
			<div
				class="flex size-full flex-col items-center justify-center gap-3 rounded border p-6"
			>
				<div class="grid w-full grid-cols-3 gap-x-3 gap-y-6">
					<div
						class="before:border-border after:border-border relative col-start-2 row-start-1 flex aspect-[3/4] items-center justify-center rounded border before:absolute before:right-[calc(100%+1px)] before:w-[calc(50%+.75rem+1px)] before:border-t after:absolute after:left-[calc(100%+1px)] after:w-[calc(50%+.75rem+1px)] after:border-t"
					></div>
					<div
						class="before:border-border relative col-start-1 row-start-2 flex aspect-[3/4] items-center justify-center rounded border before:absolute before:bottom-[calc(100%+1px)] before:h-[calc(50%+1.75rem-3px)] before:border-l"
					></div>
					<div
						class="before:border-border relative col-start-2 row-start-2 flex aspect-[3/4] items-center justify-center rounded border before:absolute before:bottom-[calc(100%+1px)] before:h-6 before:border-l"
					></div>
					<div
						class="before:border-border relative col-start-3 row-start-2 flex aspect-[3/4] items-center justify-center rounded border before:absolute before:bottom-[calc(100%+1px)] before:h-[calc(50%+1.75rem-3px)] before:border-l"
					></div>
				</div>
			</div>
			<Button variant="secondary" disabled>Reroll</Button>
		</aside>
	</div>

	<div
		class="text-body pointer-events-none grid size-full grid-cols-1 items-center justify-center gap-6 p-6 pt-0 md:gap-12 md:p-12 md:pt-0 lg:grid-cols-12 lg:overflow-y-scroll lg:pt-12"
		bind:this={scrollEl}
	>
		<aside class="col-span-4"></aside>
		<main
			class="pointer-events-auto col-span-8 mb-6 flex size-full flex-col gap-6 md:mb-12 lg:mb-0"
		>
			<div class="flex flex-col gap-6 md:gap-12">
				{#each orderByOption.orderedItems as group, i}
					{@const isLastGroup = i >= orderByOption.orderedItems.length - 1}
					<h2
						class="text-foreground flex items-center gap-3 text-xl md:text-2xl"
					>
						{#if group.icon}
							<div
								class={cn(
									"flex size-8 shrink-0 items-center justify-center rounded border",
									group.iconColors
										? group.iconColors.bg && group.iconColors.border
										: "bg-primary/20 border-primary",
								)}
							>
								<group.icon
									class={cn(
										"text-primary size-5",
										group.iconColors ? group.iconColors.text : "text-primary",
									)}
								/>
							</div>
						{/if}
						{group.title}
						{#if $ORDER_BY === "collection" || $ORDER_BY === "rarity"}
							<span class="text-body/70 ml-auto text-sm"
								>{group.items.filter((item) =>
									$GAME_DATA.inventory.find(
										(invItem) => invItem.item === item.id,
									),
								).length}/{group.items.length}</span
							>
						{/if}
					</h2>
					<div class="grid grid-cols-2 gap-3 md:grid-cols-3">
						{#each group.items as item (item.id)}
							{@const quantity =
								$GAME_DATA.inventory.find((x) => x.item === item.id)
									?.quantity || 0}
							{@const owned = quantity > 0}
							{@const rarity =
								RARITIES.find((x) => x.id === item.rarity) || RARITIES[0]}
							<button
								disabled={!owned}
								onclick={() => owned && (viewItem = item)}
								class={cn(
									"relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded border p-3",
									owned &&
										"group ease-elastic cursor-pointer transition-all hover:scale-105",
								)}
								in:fade={{ duration: 300 }}
								animate:flip={{ duration: 300 }}
							>
								{#if quantity > 1}
									<span
										class="bg-muted/50 text-muted-foreground absolute top-3 right-3 rounded px-1.5 text-sm"
									>
										{quantity}
									</span>
								{/if}
								<figure
									class="relative my-auto flex aspect-square w-2/3 items-center justify-center"
								>
									<img
										src="/img/gachapon/{item.id}.webp"
										alt=""
										class={cn(
											"pointer-events-none relative z-20 select-none",
											owned
												? "ease-elastic transition-all group-hover:scale-125"
												: "opacity-20 brightness-0 contrast-0 dark:brightness-999999",
										)}
									/>
									{#if owned}
										<span
											class={cn(
												"absolute z-10 size-full rounded-full opacity-15 blur-3xl dark:opacity-30",
												rarity.bgColor,
											)}
										></span>
									{/if}
								</figure>
								<div
									class="text-fore text-foreground flex flex-col items-center gap-1 text-sm leading-4 md:gap-0.5 md:text-base"
								>
									<p>{owned ? item.label : "??????"}</p>
									<span
										class={cn(
											"rounded px-1 text-xs font-medium md:text-sm",
											rarity.textColor,
											rarity.badgeColor,
										)}
									>
										{rarity.label}
									</span>
								</div>
							</button>
						{/each}
					</div>
					{#if !isLastGroup}
						<hr />
					{/if}
				{/each}
			</div>
		</main>
		<aside class="col-span-3 hidden"></aside>
	</div>
</div>

<InventoryItem bind:item={viewItem} />
