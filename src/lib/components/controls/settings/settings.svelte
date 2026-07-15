<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { m } from "$lib/paraglide/messages";
	import { IS_DESKTOP } from "$lib/stores";
	import { cn } from "$lib/utils";
	import {
		Settings4LineSystem,
		VolumeUpLineMedia,
		SpeedLineMedia,
		LightbulbFlashLineOthers,
	} from "svelte-remix";
	import { Switch } from "$lib/components/ui/switch";
	import { Button } from "$lib/components/ui/button";
	import SettingsItem from "./settings-item.svelte";
	import SettingsModeToggle from "./settings-mode-toggle.svelte";
	import SettingsProse from "./settings-prose.svelte";
	import { SOUND_ENABLED } from "$lib/audio";
	import SettingsNoise from "./settings-noise.svelte";
	import {
		MAKE_ELEVATOR_FASTER,
		NOISE_SETTING,
		PROSE_SIZE,
		USE_DYSLEXIA_FONT,
	} from "$lib/settings";
	import { setMode } from "mode-watcher";
	import SettingsDyslexiaFont from "./settings-dyslexia-font.svelte";

	let { class: className }: { class?: string } = $props();

	const resetSettings = () => {
		setMode("dark");
		$PROSE_SIZE = { base: "16px", xl: "18px" };
		$USE_DYSLEXIA_FONT = false;
		$SOUND_ENABLED = true;
		$NOISE_SETTING = "animated";
		$MAKE_ELEVATOR_FASTER = false;
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			"hover:text-accent-foreground flex size-10 cursor-pointer items-center justify-center gap-4.5 rounded transition-all",
			className,
		)}
	>
		<Settings4LineSystem class="size-5" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="w-[calc(100dvw-3rem)] md:w-md"
		align="start"
		alignOffset={!$IS_DESKTOP ? -30 : 0}
	>
		<DropdownMenu.Group>
			<DropdownMenu.Label class="text-lg">{m.settings()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<SettingsModeToggle />
			<SettingsProse />
			<SettingsDyslexiaFont />
			<SettingsItem icon={VolumeUpLineMedia} label={m.settings_sound()}>
				<Switch bind:checked={$SOUND_ENABLED} />
			</SettingsItem>
			<SettingsNoise />
			<SettingsItem icon={SpeedLineMedia} label={m.settings_elevator_speed()}>
				<Switch bind:checked={$MAKE_ELEVATOR_FASTER} />
			</SettingsItem>
			<SettingsItem
				icon={LightbulbFlashLineOthers}
				label={m.settings_adhd_mode()}
			>
				<Switch disabled />
			</SettingsItem>
			<DropdownMenu.Separator class="mt-1.5" />
			<div class="flex justify-end px-2 py-1.5">
				<Button variant="primary-ghost" size="sm" onclick={resetSettings}>
					{m.reset_settings()}
				</Button>
			</div>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
