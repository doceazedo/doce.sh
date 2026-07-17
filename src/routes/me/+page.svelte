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
		CodeSSlashLineDevelopment,
		EmotionHappyFillUserFaces,
		EmotionUnhappyFillUserFaces,
		Heart3LineHealthMedical,
		ShakeHandsLineBusiness,
		SoundcloudLineLogos,
	} from "svelte-remix";
	import Map from "./map.svelte";
	import { distance } from "@turf/turf";
	import { MY_LOCATION, SOCIALS, WORK } from "$lib/constants";
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
		"/img/me/copacabana.webp",
		"/img/me/wicked.webp",
	];

	const TLDR = [
		{
			icon: Cake2LineFood,
			text: `I'm <span>${myAge()}</span>! I was born in <span>January 21</span>, so that would make me an <span>Aquarius</span>.`,
		},
		{
			icon: Cake2LineFood,
			prideFlag: true,
			text: "I'm a non-binary person and my pronouns are <span>he/they</span>.",
		},
		{
			icon: Heart3LineHealthMedical,
			text: "I'm interested in coding, music, DJing, videogames & tennis.",
		},
		{
			icon: Cat,
			text: "I have two cute little prick boy cats called <span>Billy</span> & <span>Salsicha</span>!",
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

	const getMusicTaste = async (): Promise<string[]> => {
		const resp = await fetch("/api/music-taste");
		const data = await resp.json();
		return data;
	};

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
	let isVinylCollectionVisible = $state(!browser);

	onMount(() => (mounted = true));
</script>

<Seo title={m.about_me_seo_title()} />

<PageTitle title={m.about_me()} subtitle={m.about_me_subtitle()} />

<div
	class="mt-6 -ml-6 flex w-dvw flex-col gap-6 overflow-x-hidden px-6 md:ml-0 md:w-full md:gap-12 md:overflow-x-visible md:px-0"
>
	<div
		class="flex w-full py-12 md:mb-6 md:gap-12 md:py-0"
	>
		{#if mounted}
			{#each PHOTOS as photo, i (i)}
				<figure
					class={cn(
						"bg-muted ease-elastic relative aspect-[4/5] w-full rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-110 hover:rotate-0",
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
		<ul class="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-x-6 gap-y-12 w-full">
			{#if mounted}
				{#each TLDR as card, i (i)}
					<li
						class={cn("flex flex-col justify-center items-center border rounded p-4 lg:py-6 lg:px-3 relative",
												i === 0 && "-rotate-0.5deg lg:-rotate-1",
												i === 1 && "rotate-0.5deg lg:rotate-1 lg:translate-x-0.5",
												i === 2 && "rotate-1 lg:rotate-2 lg:-translate-x-1",
												i === 3 && "-rotate-0.5deg lg:-rotate-1",)}
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
								class={cn("bg-[color-mix(in_srgb,var(--background),var(--primary)_20%)] border-primary flex size-8 items-center justify-center rounded border lg:size-12 absolute", 
									i === 0 && "-top-6",
									i === 2 && "-top-6",
									i === 3 && "-top-6"
								)}
							>
								<card.icon class="text-primary size-5 lg:size-6" />
							</div>
						{/if}
						<p class={cn("text-center text-foreground/80 [&>span]:text-foreground md:mt-1", card.prideFlag && "mt-1 md:mt-0")}>{@html card.text}</p>
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
					class="bg-muted relative aspect-video lg:aspect-auto lg:h-full w-full overflow-hidden rounded before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-10 before:size-full before:rounded before:border before:border-white/10"
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

	<SectionTitle title="Personal life" />
	<Prose>
		<p>
			{m.personally_intro()}
		</p>
		<p>
			{@html m.personally_work({
				companyName: WORK.company,
				companyUrl: WORK.url,
			})}
		</p>
		<p>
			{m.personally_early_days()}
		</p>
		<p>
			{m.personally_hobbies()}
		</p>
		<p>Intro</p>
		<p>Cats</p>
		<p>Hobbies</p>
	</Prose>

	<hr />

	<SectionTitle title={m.about_music()} />
	<div class="flex flex-col gap-6 lg:grid lg:grid-cols-2">
		<div class="flex flex-col gap-3 rounded border p-3 md:gap-6 md:p-6">
			<hgroup>
				<h3 class="mb-0.5 text-xl md:text-2xl">{m.music_taste()}</h3>
				<p class="text-body leading-5">
					{m.music_taste_subtitle()}
				</p>
			</hgroup>
			<div class="flex flex-col gap-1.5">
				<h3 class="text-medium text-primary text-sm uppercase">
					{m.top_tags()}
				</h3>
				<div class="flex flex-wrap gap-1.5">
					{#await getMusicTaste()}
						<Skeleton class="h-[30px] w-20 rounded-full" />
						<Skeleton class="h-[30px] w-24 rounded-full" />
						<Skeleton class="h-[30px] w-20 rounded-full" />
						<Skeleton class="h-[30px] w-12 rounded-full" />
						<Skeleton class="h-[30px] w-28 rounded-full" />
						<Skeleton class="h-[30px] w-24 rounded-full" />
						<Skeleton class="h-[30px] w-20 rounded-full" />
						<Skeleton class="h-[30px] w-24 rounded-full" />
					{:then tags}
						{#each tags as tag}
							<a
								href="https://www.last.fm/tag/{tag.replaceAll(' ', '+')}"
								target="_blank"
								rel="noopener noreferrer"
								class="ease-elastic text-body hover:text-foreground rounded-full border px-3 py-0.5 transition-all hover:-translate-y-0.5"
							>
								{tag}
							</a>
						{/each}
					{/await}
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-3 rounded border p-3 md:gap-6 md:p-6">
			<hgroup>
				<h3 class="mb-0.5 text-xl md:text-2xl">{m.about_dj()}</h3>
				<p class="text-body leading-5">
					{m.about_dj_subtitle()}
				</p>
			</hgroup>
			<iframe
				width="100%"
				height="166"
				scrolling="no"
				frameborder="no"
				allow="autoplay"
				src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1846080000&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false"
				title="SoundCloud"
			></iframe>
			<Button
				href={SOCIALS.soundcloud.url}
				target="_blank"
				class="mt-auto w-fit bg-[#ff7700] hover:bg-[#ff7700dd]"
			>
				<SoundcloudLineLogos class="size-5" />
				{m.more_on_soundcloud()}
			</Button>
		</div>
		<div
			class="col-span-2 flex flex-col gap-3 rounded border p-3 md:gap-6 md:p-6"
			use:onVisible={() => (isVinylCollectionVisible = true)}
		>
			<hgroup>
				<h3 class="mb-0.5 text-xl md:text-2xl">{m.vinyl_collection()}</h3>
				<p class="text-body leading-5">
					{m.vinyl_collection_subtitle()}
				</p>
			</hgroup>
			<div class="grid grid-cols-6 gap-3 lg:grid-cols-12">
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
												delay: 25 * i,
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
				class="ml-auto w-fit"
			>
				{m.see_on_discogs()}
				<ArrowRightLineArrows class="size-5" />
			</Button>
		</div>
	</div>

	<hr />

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each LIKES_DISLIKES as column, i}
			<div
				class={cn(
					"flex flex-col gap-3 rounded border p-3 md:gap-6 md:p-6",
					i === 0
						? "border-green-500 bg-green-500/5 dark:bg-green-500/20 [&_i]:bg-green-500"
						: "border-red-700 bg-red-700/5 dark:bg-red-700/20 [&_i]:bg-red-700",
				)}
			>
				<div class="flex items-center gap-3">
					<i
						class="flex size-10 shrink-0 items-center justify-center rounded text-white"
					>
						<column.icon class="size-6" />
					</i>
					<h2 class="text-2xl md:text-3xl">{column.title}</h2>
				</div>
				<ul class="flex flex-col gap-1.5">
					{#each column.items as item}
						<li class="text-foreground/80 flex items-center gap-1">
							<column.bullet
								class={cn("", i === 0 ? "text-green-500" : "text-red-700")}
							/>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<hr />

	<SectionTitle title={m.lets_have_fun()} />
	<div
		class="prose prose-neutral dark:prose-invert prose-a:hover:text-primary prose-a:transition-all w-full max-w-none"
	>
		{@html m.lets_have_fun_description()}
	</div>
</div>
