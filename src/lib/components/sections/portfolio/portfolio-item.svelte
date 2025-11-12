<script lang="ts">
	import { cn, sleep } from "$lib/utils";
	import GumballSpoiler from "$lib/components/icons/gumball-spoiler.svg?component";
	import GumballOutline from "$lib/components/icons/gumball-outline.svg?component";
	import type { Project } from "$lib/types";
	import * as Dialog from "$lib/components/ui/dialog";
	import {
		GAME_DATA,
		GAME_STATE,
		GIFT_ITEM,
	} from "$lib/components/misc/gachapon/stores";
	import Gachapon from "$lib/components/misc/gachapon/index";
	import { m } from "$lib/paraglide/messages";
	import { Button } from "$lib/components/ui/button";
	import { QuestionMarkEditor } from "svelte-remix";
	import { onVisible } from "$lib/utils/actions";
	import { browser } from "$app/environment";
	import { elasticFly, elasticScale } from "$lib/utils/transitions";
	import { fade } from "svelte/transition";
	import { IS_DESKTOP } from "$lib/stores";
	import Sunburst from "$lib/components/icons/sunburst.svg?component";

	let {
		project,
		type = "desktop",
		direction = "column",
	}: {
		project: Project;
		type?: "desktop" | "mobile" | "gachapon";
		direction?: "column" | "row";
	} = $props();

	let visible = $state(!browser);
	let showVideo = $state(false);
	let delay = type === "gachapon" && $IS_DESKTOP ? 300 : 0;
	let hasPlayedGachapon = $derived($GAME_DATA.inventory.length !== 0);
	let GumballIcon = $derived(
		hasPlayedGachapon ? GumballOutline : GumballSpoiler,
	);

	const handleVisibilityChange = async () => {
		visible = true;

		if (!project.video) return;
		await sleep(800);
		showVideo = true;
	};

	const resetGachaponState = () => {
		$GAME_STATE = "idle";
		$GIFT_ITEM = null;
	};
</script>

<Dialog.Root onOpenChange={() => type === "gachapon" && resetGachaponState()}>
	<Dialog.Trigger
		class={cn(
			"group hover:bg-primary/5 dark:hover:bg-primary/10 aspect-square w-full cursor-pointer overflow-hidden rounded transition-all",
			type === "desktop" ? "md:aspect-video" : "md:aspect-[4/5]",
		)}
	>
		<div class="flex size-full" use:onVisible={handleVisibilityChange}>
			{#if visible}
				<div
					class={cn(
						"group-hover:before:border-primary before:border-border relative flex size-full flex-col items-center gap-12 rounded px-6 pt-6 text-center transition-all before:absolute before:top-0 before:left-0 before:z-10 before:size-full before:rounded before:border before:transition-all md:px-12",
						direction === "row" &&
							"md:flex-row md:gap-20 md:p-12 md:pr-0 md:text-left",
						type === "gachapon" && "pb-12",
					)}
					in:fade={{
						duration: 400,
						delay,
					}}
				>
					<hgroup class="z-10 flex flex-col">
						<p
							class="text-primary -mb-1 text-sm font-semibold uppercase"
							in:elasticFly={{
								y: -12,
								duration: 800,
								delay,
							}}
						>
							{project.pretitle}
						</p>
						<h3
							class="mb-1.5 text-2xl"
							in:elasticFly={{
								y: -12,
								duration: 800,
								delay: delay + 100,
							}}
						>
							{project.title}
						</h3>
						<p
							class={cn(
								"text-body leading-5",
								type === "desktop" ? "max-w-96" : "max-w-72",
							)}
							in:elasticFly={{
								y: -12,
								duration: 800,
								delay: delay + 200,
							}}
						>
							{project.description}
						</p>
					</hgroup>

					{#if type === "gachapon"}
						<div
							class="relative flex size-full max-w-48 items-center justify-center"
							in:elasticScale|global={{
								start: 0.75,
								duration: 800,
								delay: delay + 300,
							}}
						>
							<GumballIcon
								class={cn(
									"ease-elastic text-muted dark:group-hover:text-border h-48 transition-all group-hover:scale-110 md:h-64 lg:h-auto",
									!hasPlayedGachapon && "opacity-50",
								)}
							/>
							{#if hasPlayedGachapon}
								<Sunburst
									class="animation-duration-10000 text-primary/40 absolute -z-20 size-[48rem] animate-spin"
								/>
								<div
									class="animation-duration-10000 from-background/80 to-background absolute -z-10 size-[64rem] animate-spin bg-radial to-30% md:to-50%"
								></div>
							{:else}
								<QuestionMarkEditor
									class="text-primary dark:text-foreground absolute size-6 transition-all group-hover:scale-110 md:size-12"
								/>
							{/if}
						</div>
					{:else}
						<div
							class={cn(
								"ease-elastic flex w-full flex-col transition-all group-hover:-translate-y-4",
								type === "desktop"
									? "rounded-lg border"
									: "w-48 lg:w-[calc(100%-6rem)]",
								direction === "row" &&
									"md:-mr-20 md:group-hover:-translate-x-4 md:group-hover:translate-y-0",
							)}
							in:elasticFly|global={{
								x: direction === "row" ? 24 : 0,
								y: direction === "column" ? 24 : 0,
								duration: 800,
								delay: delay + 400,
							}}
						>
							{#if type === "desktop"}
								<ul
									class="bg-border flex w-full gap-1.5 rounded-t-lg p-2.5 transition-all"
								>
									<li
										class="bg-foreground/10 size-3 rounded-full transition-all group-hover:bg-red-400"
									></li>
									<li
										class="bg-foreground/10 size-3 rounded-full transition-all group-hover:bg-yellow-400"
									></li>
									<li
										class="bg-foreground/10 size-3 rounded-full transition-all group-hover:bg-green-400"
									></li>
								</ul>
							{/if}
							<figure
								class={cn(
									"relative flex w-full flex-col items-center overflow-hidden transition-all",
									type === "desktop"
										? "aspect-video rounded-b-lg"
										: "aspect-[9/16] rounded-3xl border-4 border-[#e5e1e8] lg:rounded-[3rem] lg:border-8 dark:border-[#2d2534]",
								)}
							>
								{#if type === "mobile"}
									<div
										class="dark:lg-top-0 absolute top-[3px] z-10 size-2.5 rounded-full bg-[#e5e1e8] transition-all md:-top-0.5 md:h-4 md:w-18 md:rounded-t-none md:rounded-b-lg lg:-top-px lg:h-6 lg:w-32 lg:rounded-b-xl dark:bg-[#2d2534]"
									></div>
								{/if}
								{#if project.video}
									<video
										class="size-full"
										src={project.video}
										muted
										autoplay
										controls={false}
										playsinline
										loop
									></video>
								{/if}
								<img
									src={project.thumbnail}
									alt=""
									class={cn(
										"absolute size-full object-cover object-top transition-all duration-800",
										showVideo && "opacity-0",
									)}
								/>
							</figure>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</Dialog.Trigger>
	<Dialog.Content
		class="h-[calc(100%-3rem)] max-w-[calc(100%-3rem)] sm:h-[calc(100%-6rem)] sm:max-w-[calc(100%-6rem)] 2xl:max-w-[96rem]"
		disableCloseButton={$GAME_STATE === "drawing"}
		escapeKeydownBehavior={$GAME_STATE === "drawing" ? "ignore" : "close"}
		onOpenAutoFocus={() => null}
	>
		<Dialog.Header>
			<Dialog.Description class="-mb-1.5 text-sm uppercase"
				>{project.pretitle}</Dialog.Description
			>
			<Dialog.Title>{project.title}</Dialog.Title>
		</Dialog.Header>
		{#if type === "gachapon"}
			<Gachapon />
		{:else}
			<Dialog.Body class="gap-6 overflow-y-scroll lg:flex-row">
				<aside
					class="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-0 lg:max-w-lg"
				>
					<div>
						<h2 class="mb-px font-medium">{m.my_role()}</h2>
						<p class="text-body">{project.role}</p>
					</div>
					<div>
						<h2 class="mb-px font-medium">{m.project_description()}</h2>
						<p class="text-body">
							{@html project.details.replaceAll("\n", "<br />")}
						</p>
					</div>
					{#if project.stack.every((x) => typeof x === "object")}
						<div>
							<h2 class="mb-1 font-medium">{m.tech_stack()}</h2>
							<ul class="flex flex-wrap gap-1.5">
								{#each project.stack as icon}
									<li
										class="[&>svg]:fill-body text-body bg-muted flex cursor-default items-center justify-center gap-1.5 rounded border px-1.5 py-1 text-sm transition-all [&>svg]:size-3.5"
									>
										{@html icon.svg}
										{icon.title}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if project.links.length > 0}
						<div>
							<h2 class="mb-1 font-medium">{m.links()}</h2>
							<ul class="flex gap-1.5">
								{#each project.links as link, i}
									<Button
										href={link.url}
										target="_blank"
										variant={i === 0 ? "default" : "secondary"}
									>
										{link.label}
									</Button>
								{/each}
							</ul>
						</div>
					{/if}
				</aside>
				<main class="flex w-full flex-col gap-6">
					{#if project.media.length > 0}
						{#each project.media as media}
							<div class="text-body flex flex-col gap-1.5 text-center">
								<div
									class="bg-muted aspect-video w-full overflow-hidden rounded border"
								>
									{#if media.url.includes("youtube")}
										<iframe
											class="size-full"
											src={media.url}
											title="YouTube video player"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
											referrerpolicy="strict-origin-when-cross-origin"
										></iframe>
									{:else}
										<img
											src={media.url}
											alt=""
											class="size-full object-cover"
										/>
									{/if}
								</div>
								<p>{media.label}</p>
							</div>
						{/each}
					{/if}
				</main>
			</Dialog.Body>
		{/if}
	</Dialog.Content>
</Dialog.Root>
