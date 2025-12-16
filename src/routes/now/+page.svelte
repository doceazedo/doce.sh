<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { toFixedIfNecessary } from "$lib/utils/numbers";
	import {
		ArrowRightLineArrows,
		BookMarkedFillDocument,
		CalendarCheckLineBusiness,
		TargetFillOthers,
		GamepadLineDevice,
		HeadphoneFillMedia,
		UserLineUserFaces,
		Progress4LineSystem,
		CircleLineDesign,
		CheckboxCircleFillSystem,
		BookReadFillDocument,
		ThumbUpFillSystem,
		PlayFillMedia,
		Game2FillOthers,
	} from "svelte-remix";
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { LAST_PLAYED_TRACKS } from "$lib/stores";
	import { Progress } from "$lib/components/ui/progress";
	import { SOCIALS } from "$lib/constants";
	import { cn } from "$lib/utils";
	import { daysAgo } from "$lib/utils/date";
	import Seo from "$lib/components/common/seo.svelte";
	import { browser } from "$app/environment";
	import { elasticFly } from "$lib/utils/transitions";
	import { onVisible } from "$lib/utils/actions";
	import type { LastPlayedGamesRecord } from "$lib/pocketbase-types";
	import { siBevy } from "simple-icons";
	import Backlog from "$lib/components/icons/backlog.svg?component";
	import PageTitle from "$lib/components/common/page-title.svelte";

	const FOCUS_UPDATED_AT = new Date("2025/12/15");

	const BOOK = {
		title: {
			en: "The Name of the Wind",
			pt: "O Nome do Vento",
		},
		subtitle: {
			en: "The Kingkiller Chronicle: Day One",
			pt: "A Crônica do Matador do Rei: Primeiro Dia",
		},
		author: "Patrick Rothfuss",
		cover: "/img/now/books/o-nome-do-vento.webp",
		url: "https://www.goodreads.com/book/show/8480575-o-nome-do-vento",
		pages: {
			read: 153,
			total: 656,
			updatedAt: new Date("2025/07/17 GMT-3"),
		},
		startedAt: new Date("2025/06/13 GMT-3"),
	};

	let lastPlayedGamesUpdatedAt = $state<Date>();
	const getLastPlayedGames = async () => {
		try {
			const resp = await fetch("/api/now/games");
			const data = (await resp.json()) as {
				games: LastPlayedGamesRecord[];
				updatedAt: string;
			};
			lastPlayedGamesUpdatedAt = data?.updatedAt
				? new Date(data.updatedAt)
				: undefined;
			return data.games;
		} catch (_error) {
			return [];
		}
	};

	const handleMissingGameCover = (event: Event) => {
		const img = event.target as HTMLImageElement;
		const placeholder = `https://placehold.co/600x900?text=${encodeURIComponent(img.alt)}`;
		if (img.src === placeholder) return;
		img.src = placeholder;
	};

	const getTopArtists = async () => {
		try {
			const resp = await fetch("/api/now/artists");
			const data = await resp.json();
			return data as {
				name: string;
				image: string;
				plays: number;
				url: string;
			}[];
		} catch (_error) {
			return null;
		}
	};

	let isReadingVisible = $state(!browser);
	let isListeningVisible = $state(!browser);
	let isPlayingGamesVisible = $state(!browser);
</script>

<Seo title={m.now_seo_title()} />

<div class="flex flex-col gap-12">
	<PageTitle title={m.now()} subtitle={m.now_subtitle()} />

	<SectionTitleWithIcon
		icon={TargetFillOthers}
		title={m.current_focus()}
		subtitle={m.current_focus_description()}
		updatedAt={FOCUS_UPDATED_AT}
	/>
	<ul class="flex flex-col gap-12">
		<li class="flex flex-col-reverse gap-6 lg:flex-row lg:gap-24">
			<figure
				class="bg-muted ease-elastic relative aspect-video w-full shrink-0 -rotate-1 rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-105 hover:rotate-0 lg:w-1/2"
				in:elasticFly|global={{
					opacity: 0,
					y: 24,
					duration: 800,
					delay: 100,
				}}
			>
				<img
					src="/img/now/youma-screenshot.webp"
					alt=""
					class="size-full rounded object-cover transition-all"
				/>
			</figure>
			<div class="flex flex-col">
				<span
					class="[&>svg]:fill-foreground mb-1.5 [&>svg]:size-6 lg:[&>svg]:size-8"
				>
					{@html siBevy.svg}
				</span>
				<h3 class="mb-1.5 text-2xl md:text-3xl">{m.youma()}</h3>
				<p
					class="text-body [&>a]:text-foreground [&>a]:hover:text-primary mb-6 [&>a]:font-medium [&>a]:underline [&>a]:transition-all"
				>
					{@html m.youma_description()}
				</p>
				<ul class="grid grid-cols-4 gap-3">
					<li class="flex gap-1.5">
						<Backlog class="text-foreground/80 size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.task_status_backlog()}</p>
							<p class="">17</p>
						</div>
					</li>
					<li class="flex gap-1.5">
						<CircleLineDesign class="text-foreground/80 size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.task_status_next()}</p>
							<p class="">12</p>
						</div>
					</li>
					<li class="flex gap-1.5">
						<Progress4LineSystem class="size-4 text-amber-400" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">
								{m.task_status_in_progress()}
							</p>
							<p class="">5</p>
						</div>
					</li>
					<li class="flex gap-1.5">
						<CheckboxCircleFillSystem class="text-primary size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.task_status_done()}</p>
							<p class="">9</p>
						</div>
					</li>
				</ul>
			</div>
		</li>

		<li class="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-24">
			<div class="flex flex-col">
				<img
					src="/img/icons/sewing.png"
					alt=""
					class="mb-1.5 size-6 transition-all lg:size-8 dark:invert"
				/>
				<h3 class="mb-1.5 text-2xl md:text-3xl">{m.sewing()}</h3>
				<p
					class="text-body [&>a]:text-foreground [&>a]:hover:text-primary mb-6 max-w-[60ch] [&>a]:font-medium [&>a]:underline [&>a]:transition-all"
				>
					{m.sewing_description()}
				</p>
			</div>
			<figure
				class="bg-muted ease-elastic relative mx-auto aspect-4/5 w-1/2 shrink-0 rotate-2 rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-105 hover:rotate-0 lg:mx-0 lg:ml-auto lg:w-1/3"
				in:elasticFly|global={{
					opacity: 0,
					y: 24,
					duration: 800,
					delay: 200,
				}}
			>
				<img
					src="/img/now/sewing-studies.webp"
					alt=""
					class="size-full rounded object-cover transition-all"
				/>
			</figure>
		</li>
	</ul>

	<hr />

	<SectionTitleWithIcon
		icon={BookMarkedFillDocument}
		title={m.reading()}
		subtitle={m.reading_subtitle()}
		updatedAt={BOOK.startedAt}
	/>
	<div
		class={cn(
			"ease-elastic-heavy transition-all duration-800",
			!isReadingVisible && "-translate-y-12",
		)}
		use:onVisible={() => (isReadingVisible = true)}
	>
		<div
			class={cn(
				"flex gap-6 transition-all duration-800",
				!isReadingVisible && "opacity-0",
			)}
		>
			<a
				href={BOOK.url}
				target="_blank"
				rel="noopener noreferrer"
				class="ease-elastic relative h-fit w-1/4 shrink-0 transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/20 hover:scale-105 hover:-rotate-1 lg:w-1/6"
			>
				<img src={BOOK.cover} alt="" class="w-full rounded" />
			</a>
			<div class="col-span-5 flex w-full flex-col gap-1.5 md:gap-3">
				<hgroup>
					<h3 class="text-2xl md:-mb-px md:text-3xl">
						{BOOK.title[getLocale()]}
					</h3>
					<p class="text-body">
						{BOOK.subtitle[getLocale()]}
					</p>
				</hgroup>
				<hr />
				<ul class="hidden gap-12 md:flex">
					<li class="flex gap-1.5">
						<UserLineUserFaces class="text-primary size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.author()}</p>
							<p class="">{BOOK.author}</p>
						</div>
					</li>
					<li class="flex gap-1.5">
						<BookReadFillDocument class="text-primary size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.started_reading()}</p>
							<p class="">{BOOK.startedAt.toLocaleDateString(getLocale())}</p>
						</div>
					</li>
					<li class="flex gap-1.5">
						<ThumbUpFillSystem class="text-primary size-4" />
						<div class="flex flex-col">
							<p class="text-body -my-0.5 text-sm">{m.do_i_recommend()}</p>
							<p class="">—</p>
						</div>
					</li>
				</ul>
				<div class="mt-auto flex flex-col gap-1.5">
					<div class="flex items-center justify-between text-sm md:text-base">
						<p class="text-body [&>span]:text-foreground">
							{@html m.pages_read({
								current: BOOK.pages.read,
								total: BOOK.pages.total,
							})}
						</p>
						<p>{Math.ceil((BOOK.pages.read / BOOK.pages.total) * 100)}%</p>
					</div>
					<Progress
						value={BOOK.pages.read}
						max={BOOK.pages.total}
						class="rounded-full lg:h-3"
					/>
				</div>
			</div>
		</div>
	</div>

	<hr />

	<SectionTitleWithIcon
		icon={HeadphoneFillMedia}
		title={m.listening()}
		subtitle={m.listening_subtitle()}
		updatedAt={new Date()}
	/>
	<div
		class="flex flex-col gap-3 md:gap-6"
		use:onVisible={() => (isListeningVisible = true)}
	>
		<div class="grid gap-6 md:grid-cols-2 md:gap-12">
			<div class="flex flex-col gap-3 md:gap-6">
				<h3 class="text-2xl md:text-3xl">{m.last_played_tracks()}</h3>
				<div class="flex flex-col gap-3">
					{#if !$LAST_PLAYED_TRACKS}
						{#each Array(5).fill(null) as _uwu}
							<Skeleton class="h-56px w-full rounded" />
						{/each}
					{:else}
						{#each $LAST_PLAYED_TRACKS as track}
							<a
								href="https://www.last.fm/music/{track.artist.replaceAll(
									' ',
									'+',
								)}/_/{track.track.replaceAll(' ', '+')}"
								target="_blank"
								rel="noopener noreferrer"
								class="ease-elastic flex items-center gap-3 transition-all hover:scale-105"
							>
								<img
									src={track.cover_url}
									alt=""
									class="size-14 rounded object-cover"
								/>
								<div class="flex flex-col justify-center">
									<p class="text-body -mb-1 text-sm">{track.artist}</p>
									<p>{track.track}</p>
								</div>
								<div class="ml-auto flex items-center gap-1.5 text-xs">
									{#if track.now_playing}
										<p class="hidden lg:block">{m.now_playing()}</p>
										<span
											class="before:animation-duration-[2s] relative flex size-1.5 items-center justify-center rounded-full bg-red-500 before:absolute before:flex before:size-2 before:animate-ping before:rounded-full before:bg-red-500/70"
										></span>
									{:else if track.played}
										{@const playedAt = new Date(track.played)}
										{@const isToday =
											new Date().toDateString() === playedAt.toDateString()}
										{@const formattedDate = playedAt.toLocaleDateString(
											getLocale(),
											{
												day: "numeric",
												month: "numeric",
											},
										)}
										{@const formattedTime = playedAt.toLocaleTimeString(
											getLocale(),
											{
												hour: "2-digit",
												minute: "2-digit",
											},
										)}

										<p class="text-body">
											{#if !isToday}
												{m.date_time({
													date: formattedDate,
													time: formattedTime,
												})}
											{:else}
												{formattedTime}
											{/if}
										</p>
									{/if}
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-3 md:gap-6">
				<h3 class="text-2xl md:text-3xl">{m.top_artists()}</h3>
				<div class="grid grid-cols-3 gap-3">
					{#await getTopArtists()}
						{#each Array(9).fill(null) as _uwu}
							<Skeleton class="aspect-square rounded" />
						{/each}
					{:then artists}
						{#each artists as artist, i}
							{@const variant = Math.floor(Math.random() * 4)}
							<Tooltip.Provider delayDuration={300}>
								<Tooltip.Root>
									<Tooltip.Trigger>
										{#if isListeningVisible}
											<a
												href={artist.url}
												target="_blank"
												rel="noopener noreferrer"
												class={cn(
													"bg-muted ease-elastic relative flex aspect-square rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:z-10 hover:scale-105 lg:hover:scale-115",
													variant === 0 && "hover:-rotate-1",
													variant === 1 && "hover:rotate-1",
													variant === 2 && "hover:-rotate-2",
													variant === 3 && "hover:rotate-2",
												)}
												in:elasticFly|global={{
													opacity: 0,
													y: 12,
													duration: 800,
													delay: 50 * i,
												}}
											>
												<img
													src={artist.image}
													alt=""
													class="size-full rounded object-cover"
												/>
											</a>
										{:else}
											<div class="aspect-square"></div>
										{/if}
									</Tooltip.Trigger>
									<Tooltip.Content
										side="bottom"
										align="center"
										class="flex cursor-default flex-col items-center"
									>
										<p>{artist.name}</p>
										<p
											class="text-body -mt-0.5 flex items-center gap-1 text-sm"
										>
											<PlayFillMedia class="text-body size-4" />
											<span class="text-foreground"> {artist.plays}</span> plays
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						{/each}
					{/await}
				</div>
			</div>
		</div>
		<Button
			href={SOCIALS.lastfm.url}
			target="_blank"
			variant="link"
			class="ml-auto"
		>
			{m.see_on_lastfm()}
			<ArrowRightLineArrows class="size-5" />
		</Button>
	</div>

	<hr />

	<SectionTitleWithIcon
		icon={Game2FillOthers}
		title={m.playing_games()}
		subtitle={m.playing_games_subtitle()}
		updatedAt={lastPlayedGamesUpdatedAt}
	/>
	<div
		class="flex flex-col gap-3 md:gap-6"
		use:onVisible={() => (isPlayingGamesVisible = true)}
	>
		<div class="grid grid-cols-3 gap-3 md:grid-cols-5 lg:gap-6">
			{#await getLastPlayedGames()}
				{#each Array(5).fill(null) as _uwu}
					<Skeleton class="aspect-[6/9] rounded" />
				{/each}
			{:then games}
				{#if isPlayingGamesVisible}
					{#each games as game, i (i)}
						{@const lastPlayed2WeeksAgo =
							new Date(game.last_played || 0).getTime() >=
							new Date().getTime() - 14 * 24 * 60 * 60 * 1000}
						<Tooltip.Provider delayDuration={300}>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<a
										href={game.store_url}
										target="_blank"
										rel="noopener noreferrer"
										class="bg-muted ease-elastic relative flex aspect-[6/9] rounded transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/15 hover:scale-105 lg:hover:scale-115"
										in:elasticFly|global={{
											opacity: 0,
											y: 12,
											duration: 800,
											delay: 50 * (i + 1),
										}}
									>
										<img
											src={game.cover_url}
											alt={game.name}
											class="size-full rounded object-cover"
											data-appid={game.id}
											onerror={handleMissingGameCover}
										/>
									</a></Tooltip.Trigger
								>
								<Tooltip.Content side="bottom" class="justify-center">
									<p class="mx-auto mb-px max-w-[20ch] text-center leading-5">
										{game.name}
									</p>
									<div class="flex items-center justify-center gap-1">
										{#if game.playtime_2weeks && lastPlayed2WeeksAgo}
											<GamepadLineDevice class="text-body size-4" />
										{:else}
											<CalendarCheckLineBusiness class="text-body size-4" />
										{/if}
										<p
											class="text-body [&>span]:text-foreground text-center text-sm"
										>
											{#if game.playtime_2weeks && lastPlayed2WeeksAgo}
												{@html m.played_last_two_weeks({
													time:
														game.playtime_2weeks >= 60
															? `${toFixedIfNecessary(game.playtime_2weeks / 60)}h`
															: `${game.playtime_2weeks}min`,
												})}
											{:else if game.last_played}
												{@html m.last_played_game({
													date: daysAgo(new Date(game.last_played)),
												})}
											{:else if game.updated}
												{@html m.updated_at({
													date: new Date(game.updated).toLocaleDateString(
														getLocale(),
													),
												})}
											{/if}
										</p>
									</div>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/each}
				{/if}
			{/await}
		</div>
		<Button
			href="https://steamcommunity.com/id/doceazedo911"
			target="_blank"
			variant="link"
			class="w-fit md:ml-auto"
		>
			{m.add_me_on_steam()}
			<ArrowRightLineArrows class="size-5" />
		</Button>
	</div>
</div>
