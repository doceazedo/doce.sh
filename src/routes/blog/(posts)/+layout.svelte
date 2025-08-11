<script lang="ts">
	import { pushState } from "$app/navigation";
	import Prose from "$lib/components/common/prose.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { SOCIALS } from "$lib/constants.js";
	import { m } from "$lib/paraglide/messages.js";
	import { getLocale } from "$lib/paraglide/runtime.js";
	import type { PostActivity } from "$lib/types.js";
	import { cn } from "$lib/utils.js";
	import { onMount } from "svelte";
	import {
		BlueskyLineLogos,
		BookReadLineDocument,
		CalendarLineBusiness,
		Chat3LineCommunication,
		EyeLineSystem,
		Heart3LineHealthMedical,
		MastodonLineLogos,
		RedditLineLogos,
		VerifiedBadgeFillBusiness,
	} from "svelte-remix";
	import Comment from "./comment.svelte";

	type Heading = {
		label: string;
		id: string;
		tag: string;
	};

	const NAVBAR_OFFSET = 80;
	const WPM = 250;

	let { children, data } = $props();

	let headingEls = $state<HTMLHeadingElement[]>([]);
	let headings = $derived<Heading[]>(
		headingEls.map((x) => ({
			label: x.id === "comments" ? m.comments() : x.innerText,
			id: x.id,
			tag: x.tagName.toLowerCase(),
		})),
	);
	let activeHeading = $state("");
	let activeHeadingIdx = $derived(
		headings.findIndex((x) => x.id === activeHeading),
	);
	let readTime = $state(1);
	let scrollY = $state(0);
	let innerHeight = $state(0);

	const onscroll = () => {
		const topVisibleTitle = headingEls.find(
			(x) => x.getBoundingClientRect().top >= NAVBAR_OFFSET,
		);
		if (!topVisibleTitle) return;
		activeHeading = topVisibleTitle.id;
	};

	let activity = $state<PostActivity>();
	const fetchSocialActivity = async () => {
		try {
			const resp = await fetch(`/blog/${data.slug}/activity.json`);
			activity = await resp.json();
		} catch (_error) {
			activity = {
				likesCount: 0,
				viewsCount: 0,
				comments: [],
			};
		}
	};

	const getCommentsSectionTitle = (count: number) => {
		if (count === 0) return m.no_comments();
		if (count === 1) return m["1_comment"]();
		return m.x_comments({ count });
	};

	const getJoinConversationLabel = (count: number) => {
		return count === 0 ? m.be_the_first_to_comment() : m.comment_on();
	};

	const setupPage = () => {
		console.log(`setting up ${data.slug}`);
		headingEls = [
			...document.querySelectorAll<HTMLHeadingElement>(
				".prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6, #comments",
			),
		];

		const prose = document.querySelector(".prose") as HTMLElement;
		const words = prose.innerText.split(" ").length;
		readTime = Math.round(words / WPM);

		activity = undefined;
		fetchSocialActivity();
	};

	onMount(setupPage);

	$effect(() => {
		if (!data.slug) return;
		setupPage();
	});

	let hasRedditPost = !!data.metadata?.redditPostId;
</script>

<svelte:window bind:scrollY bind:innerHeight {onscroll} />

<Seo
	title="{data.metadata.title} • Doce Fernandes"
	thumbnail="/blog/{data.slug}.png"
/>

{#key data.slug}
	<div class="flex w-full flex-col gap-12 py-12">
		<div class="flex w-full gap-12 pt-12 md:pb-12">
			<main class="mx-auto flex w-full max-w-2xl shrink-0 flex-col gap-12">
				<header class="flex gap-3">
					<img src={data.metadata.icon} alt="" class="size-12" />
					<div class="flex flex-col gap-3">
						<h1 class="text-3xl font-semibold lg:text-4xl">
							{data.metadata.title}
						</h1>
						<div
							class="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3"
						>
							<div class="text-body flex items-center gap-1.5">
								<CalendarLineBusiness class="size-4" />
								<p class="[&>span]:text-foreground">
									{@html m.published_at({
										date: new Date(
											`${data.metadata.date} GMT-3`,
										).toLocaleDateString(
											getLocale(),
											getLocale() === "en"
												? {
														day: "numeric",
														month: "short",
														year: "numeric",
													}
												: undefined,
										),
									})}
								</p>
							</div>
							<span class="text-body/70 hidden md:block">&bull;</span>
							<div class="text-body flex items-center gap-1.5">
								<BookReadLineDocument class="size-4" />
								<p class="[&>span]:text-foreground">
									{@html m.read_time({
										min: readTime,
									})}
								</p>
							</div>
						</div>
					</div>
				</header>
				<Prose>
					{@render children()}
				</Prose>
				<a
					href="/ai"
					class="ease-elastic hover:bg-primary/10 hover:border-primary hover:text-foreground text-body [&_u]:text-foreground hover:[&_u]:text-primary mx-auto flex w-fit items-center gap-1.5 rounded border px-2 py-1.5 text-sm transition-all hover:scale-105 [&_u]:transition-all"
				>
					<VerifiedBadgeFillBusiness class="text-primary size-5" />
					<p>{@html m.blog_footnote()}</p>
				</a>
				<div class="flex items-center gap-6">
					<hr class="w-full" />
					<div class="text-body flex items-center gap-1.5">
						<Heart3LineHealthMedical class="size-5" />
						{activity ? activity.likesCount : "—"}
					</div>
					<div class="text-body flex items-center gap-1.5">
						<Chat3LineCommunication class="size-5" />
						{activity ? activity.comments.length : "—"}
					</div>
					<div class="text-body flex items-center gap-1.5">
						<EyeLineSystem class="size-5" />
						{activity ? activity.viewsCount : "—"}
					</div>
					<hr class="w-full" />
				</div>
				<div class="flex flex-col gap-3">
					<h1 id="comments" class="text-3xl font-semibold lg:text-4xl">
						{getCommentsSectionTitle(activity?.comments?.length || 0)}
					</h1>
					<div
						class="text-body flex flex-col gap-1.5 md:flex-row md:items-center"
					>
						{getJoinConversationLabel(activity?.comments?.length || 0)}
						<div class="flex gap-1.5">
							<Button
								href="https://bsky.app/profile/{SOCIALS.bluesky
									.handle}/post/{data.metadata?.blueskyPostId || ''}"
								target="_blank"
								rel="noopener noreferrer"
								variant="outline"
								size="sm"
							>
								<BlueskyLineLogos class="size-5" />
								Bluesky
							</Button>
							{#if !hasRedditPost}
								{m.or()}
							{/if}
							<Button
								href="{SOCIALS.mastodon.url}/{data.metadata?.mastodonPostId ||
									''}"
								target="_blank"
								rel="noopener noreferrer"
								variant="outline"
								size="sm"
							>
								<MastodonLineLogos class="size-5" />
								Mastodon
							</Button>
							{#if hasRedditPost}
								<Button
									href="https://www.reddit.com/comments/{data.metadata
										.redditPostId}"
									target="_blank"
									rel="noopener noreferrer"
									variant="outline"
									size="sm"
								>
									<RedditLineLogos class="size-5" />
									Reddit
								</Button>
							{/if}
						</div>
					</div>
				</div>
				<ul class="flex flex-col gap-6">
					{#if activity}
						{#each activity.comments as comment, i}
							{@const hasReply = comment.replies.length > 0}
							<li
								class={cn(
									hasReply &&
										"before:border-border relative before:absolute before:top-[60px] before:left-6 before:h-[calc(100%-60px+24px+24px)] before:w-[24px] before:rounded-bl before:border-b before:border-l",
								)}
							>
								<Comment {comment} {i} />
							</li>
							{#each comment.replies as reply, j}
								<li class="ml-15">
									<Comment comment={reply} i={j} isReply />
								</li>
							{/each}
						{/each}
					{:else}
						<Skeleton class="h-24 w-full" />
						<Skeleton class="h-24 w-full" />
						<Skeleton class="h-24 w-full" />
					{/if}
				</ul>
			</main>
			<aside
				class="sticky top-32 hidden h-fit w-full max-w-[19rem] flex-col gap-3 border-l lg:flex"
			>
				<h1 class="ml-6 font-medium">{m.toc()}</h1>
				<div class="relative flex flex-col gap-1.5">
					{#each headings as heading, i}
						{@const isActive =
							activeHeading === heading.id || (activeHeading === "" && i === 0)}
						<a
							href="#{heading.id}"
							onclick={(e) => {
								e.preventDefault();
								const top =
									headingEls[i].getBoundingClientRect().top +
									scrollY -
									NAVBAR_OFFSET -
									24;
								pushState(`/blog/${data.slug}#${heading.id}`, {});
								window.scrollTo({
									top,
									left: 0,
									behavior: "smooth",
								});
							}}
							class={cn(
								"text-body hover:text-foreground relative flex h-6 items-center transition-all",
								isActive && "text-foreground",
								heading.tag === "h1" && "pl-6",
								heading.tag === "h2" && "pl-6",
								heading.tag === "h3" && "pl-10",
								heading.tag === "h4" && "pl-14",
								heading.tag === "h5" && "pl-18",
							)}
						>
							<p class="truncate">
								{heading.label}
								{#if heading.id === "comments" && activity?.comments?.length}
									({activity.comments.length})
								{/if}
							</p>
						</a>
					{/each}
					<span
						class="bg-primary ease-elastic absolute top-0 -left-px h-6 w-px transition-all duration-300"
						style="top:{activeHeadingIdx >= 0 ? activeHeadingIdx * 30 : 0}px"
					></span>
				</div>
			</aside>
		</div>
	</div>
{/key}
