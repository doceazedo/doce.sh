<script lang="ts">
	import BrazilFlag from "$lib/components/icons/brazil-flag.svg?component";
	import UsaFlag from "$lib/components/icons/usa-flag.svg?component";
	import { GlobalLineBusiness } from "svelte-remix";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { getLocale, setLocale } from "$lib/paraglide/runtime";
	import { m } from "$lib/paraglide/messages";
	import { IS_DESKTOP } from "$lib/stores";

	let selectedLang = $state(getLocale());

	const LANGUAGES = {
		en: {
			code: "en",
			label: m.locale_en(),
			flag: UsaFlag,
		},
		pt: {
			code: "pt",
			label: m.locale_pt(),
			flag: BrazilFlag,
		},
	} as const;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="hover:text-accent-foreground flex size-10 cursor-pointer items-center justify-center gap-2.5 rounded transition-all"
	>
		<GlobalLineBusiness class="size-5" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-48" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{m.select_language()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each Object.values(LANGUAGES) as lang}
				<DropdownMenu.CheckboxItem
					checked={selectedLang === lang.code}
					onCheckedChange={() => {
						selectedLang = lang.code;
						setLocale(lang.code);
					}}
					closeOnSelect={false}
				>
					<i class="size-4 overflow-hidden rounded-full">
						<lang.flag class="size-4" />
					</i>
					{lang.label}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
