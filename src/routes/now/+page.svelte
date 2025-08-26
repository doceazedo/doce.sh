<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { toFixedIfNecessary } from "$lib/utils/numbers";
	import {
		ArrowRightLineArrows,
		BookMarkedFillDocument,
		BookMarkedLineDocument,
		CalendarCheckLineBusiness,
		CalendarLineBusiness,
		CodeSSlashLineDevelopment,
		Edit2LineDesign,
		GamepadFillDevice,
		GamepadLineDevice,
		GitRepositoryCommitsLineDevelopment,
		GraduationCapFillOthers,
		HeadphoneFillMedia,
		UserLineUserFaces,
	} from "svelte-remix";
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { IS_DESKTOP, LAST_PLAYED_TRACKS } from "$lib/stores";
	import { Progress } from "$lib/components/ui/progress";
	import { SOCIALS, WORK } from "$lib/constants";
	import { cn } from "$lib/utils";
	import { daysAgo } from "$lib/utils/date";
	import Seo from "$lib/components/common/seo.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { elasticFly } from "$lib/utils/transitions";
	import { onVisible } from "$lib/utils/actions";
	import { Tween } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";
	import type { LastPlayedGamesRecord } from "$lib/pocketbase-types";

	type Availability = {
		label: string;
		available: boolean | "partial";
	};

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

	const getLastPlayedGames = async (): Promise<LastPlayedGamesRecord[]> => {
		try {
			const resp = await fetch("/api/now/games");
			return await resp.json();
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

	const CURRENT_PROJECT_DEADLINES = [
		new Date("2025/07/27"), // Tekne
	];

	const BLOCKED_FREELANCE_MONTHS = [
		0, // Jan (New Years)
		11, // Dec (Christmas)
	];

	const PARTIALLY_BLOCKED_FREELANCE_MONTHS = [
		2, // Mar (Carnival)
		9, // Oct (Usually on vacation)
	];

	const getNewProjectsAvailability = (monthsAhead = 6): Availability[] => {
		const today = new Date();

		return Array.from({ length: monthsAhead }, (_uwu, i) => {
			const targetDate = new Date(today);
			targetDate.setMonth(today.getMonth() + i);

			const monthIdx = targetDate.getMonth();
			const label = targetDate
				.toLocaleDateString(getLocale(), { month: "long" })
				.slice(0, 3)
				.toUpperCase();

			const hasCurrentProjects = CURRENT_PROJECT_DEADLINES.some(
				(deadline) => targetDate <= deadline,
			);
			if (hasCurrentProjects) {
				return { label, available: false };
			}

			const isCurrentMonth = monthIdx === today.getMonth();
			if (isCurrentMonth) {
				return { label, available: "partial" };
			}

			if (PARTIALLY_BLOCKED_FREELANCE_MONTHS.includes(monthIdx)) {
				return { label, available: "partial" };
			}

			const isBlocked = BLOCKED_FREELANCE_MONTHS.includes(monthIdx);
			return { label, available: !isBlocked };
		});
	};

	const getNewProjectsBookingStatus = () => {
		const availability = getNewProjectsAvailability();
		const availableMonths = availability.filter(
			(x) => x.available === true,
		).length;
		if (availableMonths === 0) return m.booking_status_closed();
		if (availableMonths <= 4) return m.booking_status_some_availability();
		return m.booking_status_open();
	};

	const getLastCommitDate = async (repo: string) => {
		try {
			const resp = await fetch(`/api/now/last-commit?repo=${repo}`);
			const data = await resp.json();
			return data?.date || null;
		} catch (_error) {
			return null;
		}
	};

	const DEV_PROJECTS = [
		{
			pretitle: m.side_project(),
			title: "Godot WRY",
			description: m.portfolio_godot_wry_description(),
			url: "https://github.com/doceazedo/godot_wry",
			lastCommitAt: getLastCommitDate("doceazedo/godot_wry"),
		},
		{
			pretitle: m.day_job(),
			title: WORK.company,
			description: WORK.description,
			url: WORK.url,
			cta: m.more_about({ subject: WORK.company }),
		},
		{
			pretitle: m.freelance(),
			title: getNewProjectsBookingStatus(),
			description: m.freelance_description(),
			url: "/contact",
			cta: m.reach_out(),
			isFreelance: true,
		},
	];

	const COLLEGE_CLASSES = {
		updatedAt: new Date("2025/06/13"),
		approved: 11,
		total: 47,
		current: [
			{
				name: {
					en: "Logic and computational mathematics",
					pt: "Lógica e matemática computacional",
				},
				classPeriodStartsAt: new Date("2025/08/04"),
				examPeriodStartsAt: new Date("2025/10/04"),
			},
			{
				name: {
					en: "Extension Project I - Computer Science",
					pt: "Projeto de Extensão I - Ciência da Computação",
				},
				classPeriodStartsAt: new Date("2025/08/04"),
				examPeriodStartsAt: new Date("2025/10/04"),
			},
		],
	};
	const COLLEGE_PROGRESS_TARGET = Math.floor(
		(COLLEGE_CLASSES.approved / COLLEGE_CLASSES.total) * 100,
	);
	// FIXME: suddenly not working so i replaced for now 0 with the target
	const COLLEGE_PROGRESS = new Tween(COLLEGE_PROGRESS_TARGET, {
		duration: 1600,
		easing: cubicInOut,
	});

	let mounted = $state(!browser);
	let isPlayingGamesVisible = $state(!browser);

	onMount(() => (mounted = true));
</script>

<Seo title={m.now_seo_title()} />

<div class="flex flex-col gap-12">
	<hgroup class="py-3 md:py-6">
		<h1 class="text-3xl md:text-4xl">{m.now()}</h1>
		<p class="text-body">{m.now_subtitle()}</p>
	</hgroup>

	<SectionTitleWithIcon
		icon={CodeSSlashLineDevelopment}
		title={m.coding()}
		subtitle={m.coding_description()}
	/>
	<div class="grid gap-6 md:grid-cols-3">
		{#if mounted}
			{#each DEV_PROJECTS as project, i (i)}
				<a
					href={project.url}
					target={!project.url.startsWith("/") ? "_blank" : undefined}
					class="ease-elastic flex flex-col gap-3 rounded border p-6 transition-all hover:scale-105"
					in:elasticFly|global={{
						opacity: 0,
						y: 24,
						duration: 800,
						delay: 100 * (i + 1),
					}}
				>
					<hgroup>
						<p class="text-primary -mb-0.5 text-xs font-semibold uppercase">
							{project.pretitle}
						</p>
						<h3 class="text-xl md:-mb-px md:text-2xl">{project.title}</h3>
					</hgroup>
					<p class="text-body leading-5">
						{project.description}
					</p>
					{#if project.isFreelance}
						<div class="grid grid-cols-6 gap-4 md:gap-2 lg:gap-3">
							{#each getNewProjectsAvailability() as month}
								<div class="flex flex-col items-center gap-0.5 text-center">
									<span
										class={cn(
											"aspect-square w-full rounded",
											month.available === true && "bg-emerald-500",
											month.available === false && "bg-red-400",
											month.available === "partial" && "bg-yellow-500",
										)}
									></span>
									<p class="text-body text-xs">{month.label}</p>
								</div>
							{/each}
						</div>
						<ul class="text-body flex items-center gap-1.5 text-xs">
							<li class="flex items-center gap-1">
								<span class="size-3 rounded-xs bg-emerald-500"></span>
								{m.booking_month_status_available()}
							</li>
							<li class="flex items-center gap-1">
								<span class="size-3 rounded-xs bg-yellow-500"></span>
								{m.booking_month_status_partial()}
							</li>
							<li class="flex items-center gap-1">
								<span class="size-3 rounded-xs bg-red-400"></span>
								{m.booking_month_status_unavailable()}
							</li>
						</ul>
					{/if}
					<div class="mt-auto flex items-center gap-1.5">
						{#if project.lastCommitAt}
							<GitRepositoryCommitsLineDevelopment class="size-4" />
							<p class="text-body flex items-center gap-1 text-sm">
								{m.last_commit()}:
								{#await project.lastCommitAt}
									<Skeleton class="h-4 w-14 rounded" />
								{:then lastCommitAt}
									{#if lastCommitAt}
										<span
											class="text-foreground hover:text-primary underline transition-all"
										>
											{daysAgo(new Date(lastCommitAt))}
										</span>
									{/if}
								{/await}
							</p>
						{:else if project.cta}
							<Button variant="link" size="sm">
								{project.cta}
								<ArrowRightLineArrows class="size-4.5" />
							</Button>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
	</div>

	<hr />

	<SectionTitleWithIcon
		icon={BookMarkedFillDocument}
		title={m.reading()}
		subtitle={m.reading_subtitle()}
	/>
	{#if mounted}
		<a
			href={BOOK.url}
			target="_blank"
			rel="noopener noreferrer"
			class="ease-elastic flex grid-cols-6 gap-6 rounded border p-3 transition-all hover:scale-105 md:grid"
			in:elasticFly|global={{
				opacity: 0,
				y: 24,
				duration: 800,
				delay: 400,
			}}
		>
			<figure
				class="relative h-fit w-1/4 shrink-0 before:absolute before:top-0 before:left-0 before:size-full before:rounded before:border before:border-white/20 md:w-auto"
			>
				<img src={BOOK.cover} alt="" class="w-full rounded" />
			</figure>
			<div class="col-span-5 flex w-full flex-col gap-1.5 md:gap-3">
				<hgroup>
					<h3 class="-mb-0.5 text-xl md:-mb-px md:text-2xl">
						{BOOK.title[getLocale()]}
					</h3>
					<p class="text-body text-xs leading-4 md:text-sm">
						{BOOK.subtitle[getLocale()]}
					</p>
				</hgroup>
				<div
					class="text-body flex flex-col gap-1.5 text-sm md:flex-row md:gap-3 md:text-base"
				>
					<p class="hidden items-center gap-1 md:flex">
						<UserLineUserFaces class="text-foreground size-3.5 md:size-4.5" />
						{BOOK.author}
					</p>
					<span class="hidden opacity-80 md:block">&bull;</span>
					<div class="flex items-center gap-1">
						<CalendarLineBusiness
							class="text-foreground size-3.5 md:size-4.5"
						/>
						<p class="[&>span]:text-foreground">
							{@html m.started_at({
								date: BOOK.startedAt.toLocaleDateString(getLocale()),
							})}
						</p>
					</div>
				</div>
				<div class="mt-auto flex flex-col gap-1.5">
					<div class="flex items-center justify-between text-sm md:text-base">
						<p class="text-body [&>span]:text-foreground">
							{@html m.pages_read({
								current: BOOK.pages.read,
								total: BOOK.pages.total,
							})}
						</p>
						<div class="text-body flex items-center gap-1 text-sm md:text-base">
							<CalendarCheckLineBusiness
								class="text-foreground size-3.5 md:size-4.5"
							/>
							<p class="[&>span]:text-foreground">
								{#if $IS_DESKTOP}
									{@html m.updated_at({
										date: BOOK.pages.updatedAt.toLocaleDateString(getLocale()),
									})}
								{:else}
									{BOOK.pages.updatedAt.toLocaleDateString(getLocale())}
								{/if}
							</p>
						</div>
					</div>
					<Progress value={BOOK.pages.read} max={BOOK.pages.total} />
				</div>
			</div>
		</a>
	{/if}

	<hr />

	<SectionTitleWithIcon
		icon={HeadphoneFillMedia}
		title={m.listening()}
		subtitle={m.listening_subtitle()}
	/>
	<div class="grid gap-6 md:grid-cols-2">
		<div class="flex flex-col gap-3">
			<h3 class="text-xl md:text-2xl">{m.last_played_tracks()}</h3>
			<div class="flex flex-col gap-3 rounded border p-3">
				{#if !$LAST_PLAYED_TRACKS}
					{#each Array(5).fill(null) as _uwu}
						<Skeleton class="h-[54px] w-full rounded" />
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
							class="ease-elastic flex items-center gap-1.5 rounded border p-1.5 pr-3 transition-all hover:-translate-y-1"
						>
							<img
								src={track.cover}
								alt=""
								class="size-10 rounded object-cover"
							/>
							<div class="flex flex-col justify-center">
								<p class="text-body -mb-1 text-sm">{track.artist}</p>
								<p>{track.track}</p>
							</div>
							<div class="ml-auto flex items-center gap-1.5 text-xs">
								{#if track.nowPlaying}
									<p class="hidden lg:block">{m.now_playing()}</p>
									<span
										class="before:animation-duration-[2s] relative flex size-1.5 items-center justify-center rounded-full bg-red-500 before:absolute before:flex before:size-2 before:animate-ping before:rounded-full before:bg-red-500/70"
									></span>
								{:else if track.playedAt}
									{@const playedAt = new Date(track.playedAt)}
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
		</div>

		<div class="flex flex-col gap-3">
			<h3 class="text-xl md:text-2xl">{m.discover_weekly()}</h3>
			<iframe
				class="aspect-square size-full rounded border md:aspect-auto"
				scrolling="no"
				frameborder="no"
				allow="autoplay"
				src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2036041653%3Fsecret_token%3Ds-0gxDfMC07SI&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true"
				title="SoundCloud"
			></iframe>
		</div>
	</div>

	<hr />

	<SectionTitleWithIcon
		icon={GamepadFillDevice}
		title={m.playing_games()}
		subtitle={m.playing_games_subtitle()}
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
								<Tooltip.Content
									side="bottom"
									class="justify-center"
									sideOffset={24}
								>
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
											class="text-body [&>span]:text-secondary-foreground text-center text-sm"
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

	<hr />

	<SectionTitleWithIcon
		icon={GraduationCapFillOthers}
		title={m.studying()}
		subtitle={m.studying_description()}
		updatedAt={COLLEGE_CLASSES.updatedAt}
	/>
	<div class="flex grid-cols-3 flex-col gap-6 md:grid md:gap-12">
		<div class="flex flex-col gap-3">
			<h3 class="text-xl md:text-2xl">{m.degree_progress()}</h3>
			<div
				class="relative mx-auto flex size-full max-w-64 items-center justify-center md:max-w-none"
				use:onVisible={() =>
					(COLLEGE_PROGRESS.target = COLLEGE_PROGRESS_TARGET)}
			>
				<svg
					class="size-full -rotate-90"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="18"
						cy="18"
						r="16"
						fill="none"
						class="stroke-primary/20"
						stroke-width="0.5"
					></circle>
					<circle
						cx="18"
						cy="18"
						r="16"
						fill="none"
						class="stroke-primary"
						stroke-width="0.5"
						stroke-dasharray="100"
						stroke-dashoffset={100 - COLLEGE_PROGRESS.current}
					></circle>
				</svg>

				<div class="absolute flex flex-col items-center gap-0.5 text-center">
					<p class="text-xl md:text-2xl">
						{Math.floor(COLLEGE_PROGRESS.current)}%
					</p>
					<p
						class="text-body [&>span]:text-foreground max-w-[15ch] text-sm leading-4 lg:max-w-none"
					>
						{@html m.classe_completed({
							approved: COLLEGE_CLASSES.approved,
							total: COLLEGE_CLASSES.total,
						})}
					</p>
				</div>
			</div>
		</div>

		<div class="col-span-2 flex flex-col gap-3">
			<h3 class="text-xl md:text-2xl">{m.current_classes()}</h3>
			{#each COLLEGE_CLASSES.current as subject}
				{@const today = new Date().getTime()}
				{@const isExamPeriod = subject.examPeriodStartsAt.getTime() <= today}
				{@const isClassPeriod = subject.classPeriodStartsAt.getTime() <= today}
				<div
					class="text-body ease-elastic group flex cursor-default items-center gap-3 rounded border p-3 transition-all hover:-translate-y-1"
				>
					{subject.name[getLocale()]}
					<span
						class={cn(
							"text-muted-foreground group-hover:bg-foreground/10 bg-muted ml-auto flex w-fit shrink-0 items-center gap-1.5 rounded px-2 py-1 text-sm transition-all",
							isExamPeriod &&
								"bg-primary text-primary-foreground group-hover:bg-primary",
						)}
					>
						{#if isExamPeriod}
							<Edit2LineDesign class="size-3.5" />
							{m.period_exams()}
						{:else if isClassPeriod}
							<BookMarkedLineDocument class="size-3.5" />
							{m.period_classes()}
						{:else}
							{m.period_soon()}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
