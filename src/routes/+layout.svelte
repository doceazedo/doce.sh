<script lang="ts">
	import "../app.css";
	import "../prism-theme-github-light.css";
	import "../prism-theme-github-dark.css";
	import { cn } from "$lib/utils";
	import LanguageSelector from "$lib/components/controls/language-selector.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		Chat1LineCommunication,
		CodeSSlashLineDevelopment,
		HourglassLineSystem,
		Loader2LineSystem,
		MenuFillSystem,
		MouseLineDevice,
		NewsLineDocument,
		PresentationFillBusiness,
		User5LineUserFaces,
	} from "svelte-remix";
	import * as Drawer from "$lib/components/ui/drawer";
	import Footer from "$lib/components/layout/footer.svelte";
	import Memoji from "$lib/components/misc/memoji.svelte";
	import { page } from "$app/state";
	import { m } from "$lib/paraglide/messages";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from "svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import GlobalState from "$lib/components/misc/global-state.svelte";
	import { MEMOJI_BLINK_COUNT } from "$lib/stores";
	import { fly } from "svelte/transition";
	import { toast } from "svelte-sonner";
	import Settings from "$lib/components/controls/settings/settings.svelte";
	import { playAudio } from "$lib/audio";
	import NoiseOverlay from "$lib/components/misc/noise-overlay.svelte";

	let { children } = $props();

	const PAGES = [
		{ label: m.talks(), href: "/talks", icon: PresentationFillBusiness },
		{ label: m.blog(), href: "/blog", icon: NewsLineDocument },
		{ label: m.about_me(), href: "/me", icon: User5LineUserFaces },
		{ label: m.now_short(), href: "/now", icon: HourglassLineSystem },
		{ label: m.uses_short(), href: "/uses", icon: MouseLineDevice },
		{ label: m.contact(), href: "/contact", icon: Chat1LineCommunication },
		{ label: m.colophon(), href: "/colophon", icon: CodeSSlashLineDevelopment },
	];

	let scrollY = $state(0);
	let isDrawerOpen = $state(false);
	let mounted = $state(false);
	let showAchievement = $state(false);

	MEMOJI_BLINK_COUNT.subscribe((count) => {
		if (count !== 5) return;
		playAudio("minecraft-xp");
		showAchievement = true;
		setTimeout(() => (showAchievement = false), 5000);
	});

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key.toLowerCase() !== "b") return;
		if (document.querySelector("input:focus")) return;

		playAudio("bus-horn");
		toast.success(m.thanks_bus_driver());
	};

	onMount(() => {
		mounted = true;
		showAchievement = false;
	});
</script>

<svelte:window bind:scrollY onkeydown={handleKeyPress} />

<ModeWatcher defaultMode="dark" disableTransitions={false} />
<Toaster richColors position="top-right" />
<GlobalState />

<nav
	class={cn(
		"bg-background/70 fixed top-0 left-0 z-40 h-16 w-full border-b px-3 backdrop-blur-md transition-colors md:h-20 md:border-b-transparent md:bg-transparent md:pr-[var(--scrollbar-width)]! md:backdrop-blur-none lg:px-0",
		scrollY > 24 &&
			"md:bg-background/70 md:border-b-border md:backdrop-blur-md",
	)}
>
	<div class="mx-auto flex size-full max-w-5xl items-center">
		<a href="/" class="flex items-center gap-1.5 font-sans! text-2xl">
			<Memoji />
			<span>
				doce<span class="text-body/70">.sh</span>
			</span>
		</a>

		<div class="text-body -mr-3 ml-auto hidden h-full items-center md:flex">
			{#each PAGES as _page}
				{@const isCurrentPage = page.url.pathname.startsWith(_page.href)}
				<a
					href={_page.href}
					class={cn(
						"hover:text-foreground flex h-full items-center px-3 transition-all",
						isCurrentPage && "text-foreground",
					)}
				>
					{_page.label}
				</a>
			{/each}

			<Settings class="-mr-1.5" />
			<LanguageSelector />
		</div>

		<Drawer.Root bind:open={isDrawerOpen}>
			<Drawer.Trigger
				class="-mr-1.5 ml-auto flex size-12 items-center justify-center md:hidden"
			>
				<MenuFillSystem class="size-6" />
			</Drawer.Trigger>
			<Drawer.Content>
				<nav class="flex flex-col">
					{#each PAGES as _page}
						{@const isCurrentPage = page.url.pathname.startsWith(_page.href)}
						{@const Icon = _page.icon}

						<Button
							href={_page.href}
							onclick={() => (isDrawerOpen = false)}
							variant="ghost"
							size="lg"
							class={cn(
								"justify-start text-left",
								isCurrentPage && "text-primary",
							)}
						>
							<Icon
								class={cn("text-body size-5", isCurrentPage && "text-primary")}
							/>
							{_page.label}
						</Button>
					{/each}
				</nav>
				<hr />
				<div class="flex">
					<LanguageSelector />
					<Settings class="-mr-1.5" />
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>
</nav>

<div class="mx-auto max-w-5xl px-6 pt-20 lg:px-0">
	{@render children()}
	<Footer />
</div>

{#if showAchievement}
	<div
		transition:fly={{ duration: 800, y: -88, opacity: 1 }}
		class="crisp fixed top-6 right-6 z-110 flex h-16 w-80 flex-col justify-center bg-[url(/img/achievement.webp)] py-2 pr-2 pl-15"
		style="image-rendering:crisp-edges;"
	>
		<p class="font-minecraft font-book -mb-1.5 text-xl text-[#ffff00]">
			{m.achievement_get()}
		</p>
		<p class="font-minecraft font-book text-xl text-white [word-spacing:2px]">
			{m.achievement_memoji_blink({ quantity: 5 })}
		</p>
	</div>
{/if}

<div
	class={cn(
		"bg-background text-body fixed top-0 left-0 z-50 flex size-full cursor-wait items-center justify-center gap-1.5 transition-all duration-100",
		mounted && "pointer-events-none opacity-0 select-none",
	)}
>
	<Loader2LineSystem class="text-primary size-6 animate-spin" />
	{m.loading()}
</div>

<NoiseOverlay />
