<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { toFixedIfNecessary } from "$lib/utils/numbers";
	import {
		ArrowRightLineArrows,
		CalendarCheckLineBusiness,
		TargetFillOthers,
		GamepadLineDevice,
		HeadphoneFillMedia,
		PlayFillMedia,
		Game2FillOthers,
		CodeSSlashLineDevelopment,
		VerifiedBadgeFillBusiness,
		Movie2FillMedia,
		StarFillSystem,
		StarHalfFillSystem,
		Heart3FillHealthMedical,
		AlignLeftEditor,
	} from "svelte-remix";
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import MediaGridSection from "$lib/components/common/media-grid-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { LAST_PLAYED_TRACKS } from "$lib/stores";
	import { SOCIALS } from "$lib/constants";
	import { cn } from "$lib/utils";
	import { lastCronRun, timeAgo } from "$lib/utils/date";
	import Seo from "$lib/components/common/seo.svelte";
	import { browser } from "$app/environment";
	import { elasticFly } from "$lib/utils/transitions";
	import { onVisible } from "$lib/utils/actions";
	import type {
		LastPlayedGamesRecord,
		StatusRecord,
		MoviesRecord,
	} from "$lib/pocketbase-types";
	import { siGodotengine } from "simple-icons";
	import TennisPlayer from "$lib/components/icons/tennis-player.svg?component";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import Prose from "$lib/components/common/prose.svelte";

	const ACTIVITIES_UPDATED_AT = new Date("2026/07/19 12:45:00 GMT-3");

	const MOVIES_UPDATED_AT = lastCronRun([6, 18]);

	const ACTIVITIES = $derived([
		{
			description: m.activity_making_game(),
			icon: siGodotengine.svg,
		},
		{
			description: m.activity_playing_tennis(),
			icon: TennisPlayer,
		},
		{
			description: m.activity_revamping_site(),
			icon: CodeSSlashLineDevelopment,
		},
	]);

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
	const lastPlayedGames = getLastPlayedGames();

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

	const getStatusUpdate = async () => {
		try {
			const resp = await fetch("/api/now/status");
			const data = (await resp.json()) as StatusRecord;
			return data;
		} catch (_error) {
			return null;
		}
	};

	const getLastWatchedMovies = async () => {
		try {
			const resp = await fetch("/api/now/movies");
			const data = (await resp.json()) as MoviesRecord[];
			return data;
		} catch (_error) {
			return [];
		}
	};
	const lastWatchedMovies = getLastWatchedMovies();

	const isEmojiOnly = (str: string) => {
		const stringToTest = str.replace(/ /g, "");
		const emojiRegex =
			/^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
		return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
	};

	let isListeningVisible = $state(!browser);
	let locale = $state(getLocale());
</script>

<Seo title={m.now_seo_title()} />

<div class="flex flex-col gap-12">
	<PageTitle title={m.now()} subtitle={m.now_subtitle()} />

	<SectionTitleWithIcon
		icon={TargetFillOthers}
		title={m.current_focus()}
		subtitle={m.current_focus_description()}
		updatedAt={ACTIVITIES_UPDATED_AT}
	/>

	<div class="flex flex-col-reverse gap-12 lg:flex-row">
		<ul class="flex w-full flex-col gap-12">
			{#each ACTIVITIES as activity}
				<li class="flex gap-4">
					<span class="[&>svg]:fill-foreground/70 shrink-0 [&>svg]:size-7">
						{#if typeof activity.icon === "string"}
							{@html activity.icon}
						{:else}
							<activity.icon class="text-foreground/70 size-7" />
						{/if}
					</span>
					<Prose>{@html activity.description}</Prose>
				</li>
			{/each}
		</ul>

		<div class="relative flex h-fit w-full shrink-0 items-center lg:w-md">
			<div
				class="border-primary z-10 flex w-fit shrink-0 flex-col gap-1 rounded border bg-[color-mix(in_srgb,var(--background),var(--primary)_20%)] p-1"
			>
				<img
					src="/img/avatar.jpg?t=1785290245"
					alt=""
					class="size-24 rounded"
				/>
				<p class="text-primary text-center font-medium tracking-wide">
					{m.update()}
				</p>
			</div>
			<div
				class="-ml-14 flex size-full flex-col gap-1.5 rounded border p-6 pb-2.5 pl-20"
			>
				{#await getStatusUpdate()}
					<p class="text-foreground flex items-center gap-1 font-medium">
						<span class="text-lg">DoceAzedo</span>
						<VerifiedBadgeFillBusiness class="text-primary size-4" />
						<span class="text-muted-foreground/80 scale-50">&bull;</span>
						<span class="text-body flex items-center gap-1.5 text-sm">
							<Skeleton class="h-5 w-24 rounded" />
						</span>
					</p>
					<div class="flex flex-col gap-1">
						<Skeleton class="h-5.5 w-full rounded" />
						<Skeleton class="h-5.5 w-1/3 rounded" />
					</div>
					<div
						class="mt-3 -ml-20 flex w-[calc(100%+6.5rem)] items-center justify-between border-t pt-2.5 pr-3 pl-20"
					>
						<span class="mb-0.5 font-medium tracking-wide">{m.feeling()}:</span>
						<Skeleton class="size-7 rounded" />
					</div>
				{:then status}
					{#if status}
						<p class="text-foreground flex items-center gap-1 font-medium">
							<span class="text-lg">DoceAzedo</span>
							<VerifiedBadgeFillBusiness class="text-primary size-4" />
							<span class="text-muted-foreground/80 scale-50">&bull;</span>
							<span class="text-body flex items-center gap-1.5 text-sm">
								{timeAgo(new Date(status.created))}
							</span>
						</p>
						<p class="text-foreground/80">
							{locale == "en" ? status.text_en : status.text_pt}
						</p>
						<div
							class="mt-3 -ml-20 flex w-[calc(100%+6.5rem)] items-center justify-between border-t pt-2.5 pr-3 pl-20"
						>
							<span class="mb-0.5 font-medium tracking-wide">
								{m.feeling()}:
							</span>
							<span
								class={cn(
									isEmojiOnly(status.feeling_en || "")
										? "text-xl"
										: "text-base",
								)}
							>
								{locale == "en" ? status.feeling_en : status.feeling_pt}
							</span>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</div>

	<hr />

	<MediaGridSection
		icon={Game2FillOthers}
		title={m.playing_games()}
		subtitle={m.playing_games_subtitle()}
		updatedAt={lastPlayedGamesUpdatedAt}
		items={lastPlayedGames}
		poster={(game) => ({
			id: game.id,
			title: game.name,
			url: game.store_url,
			image: game.cover_url,
		})}
		link={{
			href: SOCIALS.steam.url,
			label: m.add_me_on_steam(),
		}}
	>
		{#snippet details(game)}
			{@const lastPlayed2WeeksAgo =
				new Date(game.last_played || 0).getTime() >=
				new Date().getTime() - 14 * 24 * 60 * 60 * 1000}
			<div class="flex items-center justify-center gap-1">
				{#if game.playtime_2weeks && lastPlayed2WeeksAgo}
					<GamepadLineDevice class="text-body size-4" />
				{:else}
					<CalendarCheckLineBusiness class="text-body size-4" />
				{/if}
				<p class="text-body [&>span]:text-foreground text-center text-sm">
					{#if game.playtime_2weeks && lastPlayed2WeeksAgo}
						{@html m.played_last_two_weeks({
							time:
								game.playtime_2weeks >= 60
									? `${toFixedIfNecessary(game.playtime_2weeks / 60)}h`
									: `${game.playtime_2weeks}min`,
						})}
					{:else if game.last_played}
						{@html m.last_played_game({
							date: timeAgo(new Date(game.last_played)),
						})}
					{:else if game.updated}
						{@html m.updated_at({
							date: new Date(game.updated).toLocaleDateString(getLocale()),
						})}
					{/if}
				</p>
			</div>
		{/snippet}
	</MediaGridSection>

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

	<MediaGridSection
		icon={Movie2FillMedia}
		title={m.watching()}
		subtitle={m.watching_subtitle()}
		updatedAt={MOVIES_UPDATED_AT}
		items={lastWatchedMovies}
		poster={(movie) => ({
			id: movie.id,
			title: `${movie.title} (${movie.release_year})`,
			url: movie.url,
			image: movie.poster,
		})}
		link={{
			href: SOCIALS.letterboxd.url,
			label: m.follow_me_on_letterboxd(),
		}}
	>
		{#snippet details(movie)}
			<p
				class="text-body [&>span]:text-foreground mb-0.5 flex items-center justify-center gap-1 text-center text-sm"
			>
				<CalendarCheckLineBusiness class="text-body size-4" />
				{@html m.last_watched_movie({
					date: timeAgo(new Date(movie.watched)),
				})}
			</p>
			<div class="flex items-center justify-center gap-1">
				<div class="flex gap-px">
					{#if movie.rating && movie.rating >= 0}
						{@const fullStars = Math.floor(movie.rating)}
						{#each Array(fullStars) as _}
							<StarFillSystem class="text-primary size-3" />
						{/each}
						{#if movie.rating > fullStars}
							<StarHalfFillSystem class="text-primary size-3" />
						{/if}
					{/if}
				</div>

				{#if movie.liked}
					<Heart3FillHealthMedical class="size-3 text-orange-400" />
				{/if}

				{#if movie.reviewed}
					<AlignLeftEditor class="text-body size-3" />
				{/if}
			</div>
		{/snippet}
	</MediaGridSection>
</div>
