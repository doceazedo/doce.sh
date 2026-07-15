<script lang="ts">
	import { cn } from "$lib/utils";
	import LanguageSelector from "$lib/components/controls/language-selector.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		Chat1LineCommunication,
		CodeSSlashLineDevelopment,
		HourglassLineSystem,
		MenuFillSystem,
		MouseLineDevice,
		NewsLineDocument,
		RssLineDevice,
		User5LineUserFaces,
	} from "svelte-remix";
	import * as Drawer from "$lib/components/ui/drawer";
	import Memoji from "$lib/components/misc/memoji.svelte";
	import { page } from "$app/state";
	import { m } from "$lib/paraglide/messages";
	import { onMount } from "svelte";
	import { MEMOJI_BLINK_COUNT } from "$lib/stores";
	import Settings from "$lib/components/controls/settings/settings.svelte";
	import { playAudio } from "$lib/audio";
	import { SOCIALS } from "$lib/constants";
	import { fly } from "svelte/transition";
	import NowPlaying from "../misc/now-playing.svelte";


	let scrollY = $state(0);
	let isDrawerOpen = $state(false);
	let showAchievement = $state(false);

	MEMOJI_BLINK_COUNT.subscribe((count) => {
		if (count !== 5) return;
		playAudio("minecraft-xp");
		showAchievement = true;
		setTimeout(() => (showAchievement = false), 5000);
	});

	const PAGES = [
		{ label: m.blog(), href: "/blog", icon: NewsLineDocument },
		{ label: m.about_me(), href: "/me", icon: User5LineUserFaces },
		{ label: m.now_short(), href: "/now", icon: HourglassLineSystem },
		{ label: m.uses_short(), href: "/uses", icon: MouseLineDevice },
		{ label: m.contact(), href: "/contact", icon: Chat1LineCommunication },
		{ label: m.colophon(), href: "/colophon", icon: CodeSSlashLineDevelopment },
	];

	const SIDEBAR_SOCIALS = [
		{
			icon: RssLineDevice,
			url: "/feed",
		},
		SOCIALS.github,
		SOCIALS.bluesky,
		SOCIALS.discord,
		SOCIALS.instagram,
	];

	onMount(() => {
		showAchievement = false;
	});
</script>

<svelte:window bind:scrollY />

<aside
  class={cn(
    "bg-background/70 fixed z-40 h-16 w-full border-b px-3 backdrop-blur-md transition-colors md:h-full md:w-3xs md:border-r md:border-b-transparent md:bg-transparent md:backdrop-blur-none md:py-6 md:px-6 xl:pl-0 shrink-0 flex items-center md:flex-col md:items-start gap-6",
    scrollY > 24 &&
      "md:bg-background/70 md:border-b-border md:backdrop-blur-md",
  )}
>
    <div class="flex items-center w-full">
      <a href="/" class="flex items-center gap-1.5 font-sans! text-2xl mr-auto">
        <Memoji />
        <span>
          doce<span class="text-body/70">.sh</span>
        </span>
      </a>
      <div class="hidden md:flex">
        <Settings class="-mr-1.5" />
        <LanguageSelector />
      </div>
    </div>

    <hr class="w-full hidden md:block">

    <div class="text-body hidden md:flex md:flex-col w-full">
      {#each PAGES as _page}
        {@const isCurrentPage = page.url.pathname.startsWith(_page.href)}
        {@const Icon = _page.icon}

        <Button
          href={_page.href}
          variant={isCurrentPage ? "primary-ghost" : "ghost"}
          size="lg"
          class={cn(
            "justify-start text-left px-2! w-[calc(100%+16px)] -ml-2",
            isCurrentPage && "text-primary",
          )}
        >
          <Icon
            class={cn("text-body/80 size-5", isCurrentPage && "text-primary")}
          />
          {_page.label}
        </Button>
      {/each}
    </div>

    <hr class="w-full hidden md:block">

    <div class="hidden gap-1 md:flex md:flex-col">
      <p class="text-lg">{m.say_hi()}</p>
      <div class="text-body flex -ml-1.5">
        {#each SIDEBAR_SOCIALS as social, i}
          <a
            href={social.url}
            target="_blank"
            class={cn(
              "hover:text-foreground ease-elastic p-1.5 transition-all hover:scale-120",
              i % 2 ? "hover:rotate-6" : "hover:-rotate-6",
            )}
          >
            <social.icon class="size-5 transition-all" />
          </a>
        {/each}
      </div>
    </div>

    <div class="hidden w-full mt-auto md:block">
      <NowPlaying />
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
</aside>

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