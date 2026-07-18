<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { m } from "$lib/paraglide/messages";
	import { cn } from "$lib/utils";
	import {
		ArrowRightLineArrows,
		Cake2LineFood,
		CheckLineSystem,
		CloseLineSystem,
		EmotionHappyFillUserFaces,
		EmotionUnhappyFillUserFaces,
		Heart3LineHealthMedical,
	} from "svelte-remix";
	import Map from "./map.svelte";
	import { distance } from "@turf/turf";
	import { MY_LOCATION, SOCIALS } from "$lib/constants";
	import { getLocale } from "$lib/paraglide/runtime";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import Seo from "$lib/components/common/seo.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { elasticFly } from "$lib/utils/transitions";
	import { onVisible } from "$lib/utils/actions";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import SectionTitle from "$lib/components/common/section-title.svelte";
	import Cat from "$lib/components/icons/cat.svg?component";
	import PrideFlag from "./pride-flag.svelte";
	import { myAge } from "$lib/utils/date";
	import Prose from "$lib/components/common/prose.svelte";

	let { data } = $props();

	const PHOTOS = [
		"/img/me/haircut.webp",
		"/img/me/lhamaday.webp",
		"/img/me/elevator.webp",
		"/img/me/copacabana.webp",
	];

	const TLDR = [
		{
			icon: Cake2LineFood,
			text: m.tldr_age({ age: myAge() }),
		},
		{
			icon: Cake2LineFood,
			prideFlag: true,
			text: m.tldr_pronouns(),
		},
		{
			icon: Heart3LineHealthMedical,
			text: m.tldr_interests(),
		},
		{
			icon: Cat,
			text: m.tldr_cats(),
		},
	];

	const LIKES_DISLIKES = [
		{
			title: m.likes(),
			icon: EmotionHappyFillUserFaces,
			bullet: CheckLineSystem,
			items: [
				m.likes_coding(),
				m.likes_full_albums(),
				m.likes_hosting(),
				m.likes_vinyl(),
				m.likes_clubbing(),
				m.likes_coke_zero(),
			],
		},
		{
			title: m.dislikes(),
			icon: EmotionUnhappyFillUserFaces,
			bullet: CloseLineSystem,
			items: [
				m.dislikes_crypto(),
				m.dislikes_networking(),
				m.dislikes_hypothetical_questions(),
				m.dislikes_touching_grass(),
			],
		},
	];

	const SOUNDCLOUD_TRACK_IDS = ["2139532389", "1846080000"];

	const getDiscogsCollection = async (): Promise<
		{
			cover: string;
			artist: string;
			title: string;
		}[]
	> => {
		const resp = await fetch("/api/discogs/collection");
		const data = await resp.json();
		return data;
	};

	let mounted = $state(!browser);
	let isPersonalLifeVisible = $state(!browser);
	let isLikesDislikesVisible = $state(!browser);
	let isVinylCollectionVisible = $state(!browser);

	onMount(() => (mounted = true));
</script>

<Seo title={m.about_me_seo_title()} />

<PageTitle title={m.about_me()} subtitle={m.about_me_subtitle()} />

<div
	class="mt-6 -ml-6 flex w-dvw flex-col gap-6 overflow-x-hidden px-6 md:ml-0 md:w-full md:gap-12 md:overflow-x-visible md:px-0"
>
	<div class="flex w-full py-12 md:mb-6 md:gap-12 md:py-0">
		{#if mounted}
			{#each PHOTOS as photo, i (i)}
				<figure
					class={cn(
						"bg-muted ease-elastic relative aspect-4/5 w-full rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-110 hover:rotate-0",
						i !== 0 && "-ml-12 lg:ml-0",
						i === 0 && "translate-y-1 -rotate-2",
						i === 1 && "translate-y-6 rotate-1",
						i === 2 && "rotate-3",
						i === 3 && "translate-y-2 -rotate-6",
					)}
					in:elasticFly|global={{
						opacity: 0,
						x: -24,
						duration: 800,
						delay: 100 * (i + 1),
					}}
				>
					<img
						src={photo}
						alt=""
						class="size-full rounded object-fill transition-all"
					/>
				</figure>
			{/each}
		{/if}
	</div>

	<hr />

	<SectionTitle title="TL;DR" />
	<div class="flex flex-col gap-6 lg:flex-row">
		<ul
			class="grid w-full grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:grid-rows-2"
		>
			{#if mounted}
				{#each TLDR as card, i (i)}
					<li
						class={cn(
							"ease-elastic relative flex flex-col items-center justify-center rounded border p-4 transition-all hover:scale-105 hover:rotate-0 lg:px-3 lg:py-6",
							i === 0 && "-rotate-0.5deg lg:-rotate-1",
							i === 1 && "rotate-0.5deg lg:translate-x-0.5 lg:rotate-1",
							i === 2 && "rotate-1 lg:-translate-x-1 lg:rotate-2",
							i === 3 && "-rotate-0.5deg lg:-rotate-1",
						)}
						in:elasticFly|global={{
							opacity: 0,
							y: 24,
							duration: 1200,
							delay: 300 + 100 * i,
						}}
					>
						{#if "prideFlag" in card && card.prideFlag}
							<div class="absolute -top-5 -rotate-1">
								<PrideFlag />
							</div>
						{:else}
							<div
								class={cn(
									"border-primary absolute flex size-8 items-center justify-center rounded border bg-[color-mix(in_srgb,var(--background),var(--primary)_20%)] lg:size-12",
									i === 0 && "-top-6",
									i === 2 && "-top-6",
									i === 3 && "-top-6",
								)}
							>
								<card.icon class="text-primary size-5 lg:size-6" />
							</div>
						{/if}
						<p
							class={cn(
								"text-foreground/80 [&>span]:text-foreground text-center md:mt-1",
								card.prideFlag && "mt-1 md:mt-0",
							)}
						>
							{@html card.text}
						</p>
					</li>
				{/each}
			{/if}
		</ul>
		{#if mounted}
			<div
				class="text-body flex shrink-0 flex-col gap-3 rounded border p-3 text-center lg:w-1/3"
				in:elasticFly|global={{
					opacity: 0,
					y: 24,
					duration: 1200,
					delay: 800,
				}}
			>
				<div
					class="bg-muted relative aspect-video w-full overflow-hidden rounded before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-10 before:size-full before:rounded before:border before:border-white/10 lg:aspect-auto lg:h-full"
				>
					<Map userLocation={data.location} />
				</div>
				<p class="[&>span]:text-foreground">
					{#if data.location}
						{@html m.map_distance({
							km: Math.floor(
								distance(MY_LOCATION, data.location, { units: "kilometers" }),
							).toLocaleString(getLocale()),
						})}
					{:else}
						{@html m.map_distance_fallback()}
					{/if}
				</p>
			</div>
		{/if}
	</div>

	<hr />

	<SectionTitle title={m.personal_life()} />
	<div
		class="flex flex-col gap-6 md:flex-row"
		use:onVisible={() => (isPersonalLifeVisible = true)}
	>
		<Prose class="[&_span]:text-foreground w-full [&_span]:font-medium">
			<p>{@html m.personal_life_intro()}</p>
			<p>{@html m.personal_life_name()}</p>
			<p>{@html m.personal_life_hobbies()}</p>
			<p>{@html m.personal_life_about_site()}</p>
		</Prose>
		<div class="mx-auto aspect-3/4 h-fit w-xs shrink-0">
			{#if isPersonalLifeVisible}
				<figure
					class="bg-muted size-full rounded"
					in:elasticFly|global={{
						opacity: 0,
						y: 24,
						duration: 600,
					}}
				>
					<img
						src="/img/me/cats-on-the-bed.webp"
						alt=""
						class="size-full rounded object-fill"
					/>
				</figure>
			{/if}
		</div>
	</div>

	<hr />

	<div
		class="grid grid-cols-1 gap-6 md:grid-cols-2"
		use:onVisible={() => (isLikesDislikesVisible = true)}
	>
		{#each LIKES_DISLIKES as column, i}
			{@const I_LIKE = i === 0}
			{#if isLikesDislikesVisible}
				<div
					class={cn(
						"flex flex-col gap-3 rounded border p-3 md:gap-6 md:p-6",
						I_LIKE
							? "border-green-500 bg-green-500/5 dark:bg-green-500/20"
							: "border-red-700 bg-red-700/5 dark:bg-red-700/20",
					)}
					in:elasticFly|global={{
						opacity: 0,
						y: 24,
						duration: 600,
						delay: 75 * (i + 1),
					}}
				>
					<div class="flex items-center gap-3">
						<i
							class={cn(
								"flex size-8 shrink-0 items-center justify-center rounded text-white md:size-12",
								I_LIKE ? "bg-green-500" : "bg-red-700",
							)}
						>
							<column.icon class="size-5 md:size-6" />
						</i>
						<h2 class="text-3xl md:text-4xl">{column.title}</h2>
					</div>
					<ul class="flex flex-col gap-1.5">
						{#each column.items as item}
							<li class="text-foreground/80 flex items-center gap-1">
								<column.bullet
									class={cn("", I_LIKE ? "text-green-500" : "text-red-700")}
								/>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/each}
	</div>

	<hr />

	<SectionTitle title={m.about_dj()} subtitle={m.about_dj_subtitle()} />
	<div class="flex flex-col items-end gap-6">
		<div class="grid w-full gap-6 md:grid-cols-2">
			{#each SOUNDCLOUD_TRACK_IDS as trackId}
				<iframe
					scrolling="no"
					frameborder="no"
					allow="autoplay"
					src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{trackId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false"
					title="SoundCloud"
					class="h-166px w-full rounded border"
				></iframe>
			{/each}
		</div>
		<Button
			href={SOCIALS.soundcloud.url}
			target="_blank"
			variant="link"
			class="w-fit"
		>
			{m.more_on_soundcloud()}
			<ArrowRightLineArrows class="size-5" />
		</Button>
	</div>

	<hr />

	<SectionTitle
		title={m.vinyl_collection()}
		subtitle={m.vinyl_collection_subtitle()}
	/>
	<div class="flex flex-col items-end gap-6">
		<div
			class="grid grid-cols-3 gap-3 lg:grid-cols-6"
			use:onVisible={() => (isVinylCollectionVisible = true)}
		>
			{#await getDiscogsCollection()}
				{#each Array(18) as _uwu}
					<Skeleton class="aspect-square size-full rounded" />
				{/each}
			{:then collection}
				{#each collection as lp, i (i)}
					{@const variant = Math.floor(Math.random() * 4)}
					{#if isVinylCollectionVisible}
						<Tooltip.Provider delayDuration={0} disableHoverableContent>
							<Tooltip.Root>
								<Tooltip.Trigger class="aspect-square">
									<div
										class={cn(
											"bg-muted ease-elastic relative size-full rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:z-10 hover:scale-125 hover:-rotate-2",
											variant === 0 && "hover:-rotate-2",
											variant === 1 && "hover:rotate-2",
											variant === 2 && "hover:-rotate-3",
											variant === 3 && "hover:rotate-3",
										)}
										in:elasticFly|global={{
											opacity: 0,
											y: 12,
											duration: 600,
											delay: 50 * i,
										}}
									>
										<img
											src={lp.cover}
											alt=""
											class="size-full rounded object-cover"
										/>
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content
									side="bottom"
									align="center"
									class="flex cursor-default flex-col items-center"
								>
									<p class="text-body -mb-0.5 text-sm">{lp.artist}</p>
									<p>{lp.title}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/if}
				{/each}
			{/await}
		</div>
		<Button
			href="{SOCIALS.discogs.url}/collection"
			target="_blank"
			variant="link"
			class="w-fit"
		>
			{m.see_on_discogs()}
			<ArrowRightLineArrows class="size-5" />
		</Button>
	</div>

	<hr />

	<SectionTitle title={m.lets_have_fun()} />
	<Prose>
		<p>{@html m.lets_have_fun_intro()}</p>
		<blockquote>{@html m.lets_have_fun_tip()}</blockquote>
	</Prose>
</div>
