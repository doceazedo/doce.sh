<script lang="ts">
	import Prose from "$lib/components/common/prose.svelte";
	import { getLocale } from "$lib/paraglide/runtime.js";
	import type { PostComment } from "$lib/types.js";
	import { cn } from "$lib/utils.js";
	import {
		BlueskyLineLogos,
		EarthFillMap,
		Heart3FillHealthMedical,
		MastodonLineLogos,
		PlayFillMedia,
		RedditLineLogos,
		VerifiedBadgeFillBusiness,
	} from "svelte-remix";

	let { comment, i }: { comment: PostComment; i: number } = $props();

	let postedAt = $derived(new Date(comment.postedAt));

	const isEmojiOnly = (str: string) =>
		str.split(" ").every((x) => /\p{Extended_Pictographic}/u.test(x));
</script>

<div class="ease-elastic flex gap-3 transition-all">
	<a
		href={comment.author.url}
		target="_blank"
		rel="noopener noreferrer"
		class={cn(
			"ease-elastic bg-muted dark:bg-muted/50 relative size-12 shrink-0 rounded-full transition-all before:absolute before:size-12 before:rounded-full before:border hover:scale-120",
			comment.source !== "reddit"
				? "before:border-white/15"
				: "before:border-border",
			i % 2 ? "hover:rotate-6" : "hover:-rotate-6",
		)}
	>
		<img
			src={comment.author.avatar}
			alt=""
			class="size-full rounded-full object-cover object-top"
		/>
	</a>
	<div class="flex w-full flex-col gap-1.5">
		<div class="flex w-full flex-col rounded border p-6 pt-4.5">
			<p class="text-foreground flex items-center gap-1.5 font-medium">
				<a
					href={comment.author.url}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-primary text-lg transition-all"
				>
					{comment.author.displayName}
				</a>
				{#if comment.author.isOp}
					<VerifiedBadgeFillBusiness class="text-primary size-4" />
				{/if}
				<span class="text-muted-foreground scale-50"> &bull; </span>
				<a
					href={comment.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-body flex items-center gap-1.5 text-sm hover:underline"
				>
					{postedAt.toLocaleDateString(getLocale(), {
						year:
							postedAt.getFullYear() !== new Date().getFullYear()
								? "numeric"
								: undefined,
						month: "short",
						day: "numeric",
					})}
					<span class="text-body/70 flex items-center gap-1">
						<span>via</span>
						{#if comment.source === "bluesky"}
							<BlueskyLineLogos class="size-4" />
						{:else if comment.source === "mastodon"}
							<MastodonLineLogos class="size-4" />
						{:else if comment.source === "reddit"}
							<RedditLineLogos class="size-4" />
							r/{comment.subreddit}
						{/if}
					</span>
				</a>
			</p>
			{#if !comment.embed && isEmojiOnly(comment.content) && !comment.content.includes("\n")}
				{@const emojiCount = comment.content.split("").length}
				<p class={emojiCount <= 3 ? "text-6xl" : "text-3xl"}>
					{@html comment.content}
				</p>
			{:else}
				<Prose class="line-clamp-6 w-full whitespace-pre-line">
					{@html comment.content}
				</Prose>
			{/if}
			{#if comment.embed}
				<div class="mt-3 w-full">
					{#if comment.embed.type === "image"}
						{@const qty = comment.embed.images.length}
						{#if qty === 1}
							{@const img = comment.embed.images[0]}
							<a
								href={img.fullsize}
								target="_blank"
								rel="noopener noreferrer"
								class="contents"
							>
								<img
									src={img.thumbnail}
									alt={img.alt || "Image"}
									class={cn(
										"ease-elastic size-full max-h-[48rem] w-full rounded transition-all hover:scale-105 md:w-[calc(50%-6px)]",
										i % 2 ? "hover:-rotate-1" : "hover:rotate-1",
									)}
								/>
							</a>
						{:else}
							<div class="grid grid-cols-2 gap-1.5">
								{#each comment.embed.images as img, i}
									<a
										href={img.fullsize}
										target="_blank"
										rel="noopener noreferrer"
										class={cn(
											"ease-elastic relative overflow-hidden rounded transition-all before:absolute before:size-full before:rounded before:border before:border-white/15 hover:z-10 hover:scale-110",
											qty === 1 && "aspect-square",
											qty === 3 && i === 0 && "row-span-2 aspect-auto! h-full",
											qty >= 3 && "aspect-video",
											i % 2 ? "hover:-rotate-1" : "hover:rotate-1",
										)}
									>
										<img
											src={img.thumbnail}
											alt={img.alt || "Image"}
											class="size-full rounded object-cover"
										/>
									</a>
								{/each}
							</div>
						{/if}
					{:else if comment.embed.type === "video" && comment.embed.thumbnail}
						<a
							href={comment.url}
							target="_blank"
							rel="noopener noreferrer"
							class={cn(
								"ease-elastic relative flex aspect-video w-full items-center justify-center overflow-hidden rounded transition-all before:absolute before:size-full before:rounded before:border before:border-white/15 hover:scale-105",
								i % 2 ? "hover:-rotate-1" : "hover:rotate-1",
							)}
						>
							<img
								src={comment.embed.thumbnail}
								alt="Video thumbnail"
								class="size-full object-cover"
							/>
							<div
								class="bg-primary/20 hover:bg-primary/40 border-primary absolute flex size-12 items-center justify-center rounded-full border transition-all"
							>
								<PlayFillMedia class="text-primary size-6" />
							</div>
						</a>
					{:else if comment.embed.type === "link"}
						<a
							href={comment.embed.url}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:bg-primary/15 ease-elastic hover:border-primary flex flex-col rounded border transition-all hover:scale-105"
						>
							{#if comment.embed.thumbnail}
								<img
									src={comment.embed.thumbnail}
									alt="Link preview"
									class="aspect-[120/63] w-full rounded-t object-cover"
								/>
							{/if}
							<hgroup class="p-3">
								<p class="line-clamp-1 font-medium">
									{comment.embed.title}
								</p>
								{#if comment.embed.description}
									<p class="text-body line-clamp-2 text-sm">
										{comment.embed.description}
									</p>
								{/if}
								<hr class="my-1.5" />
								<div class="text-body/70 flex items-center gap-1 text-xs">
									<EarthFillMap class="size-3" />
									{new URL(comment.embed.url).host}
								</div>
							</hgroup>
						</a>
					{:else if comment.embed.type === "gifv"}
						<a
							href={comment.embed.url}
							target="_blank"
							rel="noopener noreferrer"
							class="contents"
							aria-label="Video"
						>
							<video
								src={comment.embed.url}
								muted
								autoplay
								loop
								playsinline
								class={cn(
									"ease-elastic size-full max-h-[48rem] w-full rounded transition-all hover:scale-105 md:w-[calc(50%-6px)]",
									i % 2 ? "hover:-rotate-1" : "hover:rotate-1",
								)}
							></video>
						</a>
					{/if}
				</div>
			{/if}
		</div>
		{#if comment.likesCount > 0}
			<div
				class="text-body flex w-full cursor-default items-center gap-1 text-sm"
			>
				<Heart3FillHealthMedical class="size-4" />
				{comment.likesCount}
			</div>
		{/if}
	</div>
</div>
