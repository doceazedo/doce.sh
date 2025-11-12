<script lang="ts">
	import { cn } from "$lib/utils";
	import {
		MoonLineWeather,
		SunLineWeather,
		PaletteLineDesign,
	} from "svelte-remix";
	import { setMode, userPrefersMode } from "mode-watcher";
	import SettingsItem from "./settings-item.svelte";
	import { m } from "$lib/paraglide/messages";

	const MODE_OPTIONS = [
		{
			value: "system" as const,
			label: "Auto",
		},
		{
			value: "light" as const,
			label: SunLineWeather,
		},
		{
			value: "dark" as const,
			label: MoonLineWeather,
		},
	];

	let selectedModeIdx = $derived(
		MODE_OPTIONS.findIndex((x) => x.value === userPrefersMode.current),
	);

	const MODE_SELECTOR_BUTTON_WIDTH = 46;
	const MODE_SELECTOR_PADDING = 4;
	const getSelectedThemePosition = (idx: number) =>
		(MODE_SELECTOR_BUTTON_WIDTH + MODE_SELECTOR_PADDING) * idx +
		MODE_SELECTOR_PADDING;
</script>

<SettingsItem icon={PaletteLineDesign} label={m.settings_mode()}>
	<div class="text-body relative flex gap-1 rounded border p-1 transition-all">
		<span
			class="ease-elastic bg-primary absolute top-1 left-1 h-7 w-11.5 rounded-xs transition-all duration-300"
			style="left:{getSelectedThemePosition(selectedModeIdx)}px"
		></span>
		{#each MODE_OPTIONS as option, i}
			{@const isActive = selectedModeIdx === i}
			<button
				class={cn(
					"z-10 flex h-7 w-11.5 cursor-pointer items-center justify-center rounded-xs text-sm transition-all",
					isActive
						? "text-primary-foreground"
						: "hover:bg-primary/20 hover:text-foreground",
				)}
				onclick={() => setMode(option.value)}
			>
				{#if typeof option.label === "string"}
					{option.label}
				{:else}
					<option.label class="size-5 transition-all" />
				{/if}
			</button>
		{/each}
	</div>
</SettingsItem>
