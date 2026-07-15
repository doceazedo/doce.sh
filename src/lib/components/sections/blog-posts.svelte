<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowRightLineArrows,
		PushpinFillMap,
		StarFillSystem,
	} from "svelte-remix";
	import { m } from "$lib/paraglide/messages";
	import { page } from "$app/state";
	import { postedAt, wasPostedThisWeek } from "$lib/utils/date";
	import { elasticFly } from "$lib/utils/transitions";
	import { browser } from "$app/environment";
	import { onVisible } from "$lib/utils/actions";

	let visible = $state(!browser);
</script>

<section class="mb-12 flex flex-col gap-12 pt-12 md:mb-24 md:pt-24">
	<header
		class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
	>
		<hgroup>
			<h2 class="text-4xl">{m.articles()}</h2>
			<p class="text-body">{m.articles_subtitle()}</p>
		</hgroup>
		<Button href="/blog" variant="link" class="w-fit">
			{m.see_all_articles()}
			<ArrowRightLineArrows class="size-5" />
		</Button>
	</header>

	<div
		class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
		use:onVisible={() => (visible = true)}
	>
		{#if visible}
			{#each page.data.posts as post, i}
				{@const publishDate = new Date(`${post.date} GMT-3`)}
				<a
					href="/blog/{post.slug}"
					class="ease-elastic hover:before:bg-primary/5 dark:hover:before:bg-primary/10 hover:before:border-primary relative flex items-center gap-3 rounded border p-6 transition-all before:absolute before:top-0 before:left-0 before:-z-10 before:size-full before:rounded before:border before:border-transparent before:transition-all hover:-translate-y-1.5"
					in:elasticFly|global={{
						opacity: 0,
						y: 24,
						duration: 800,
						delay: 100 * (i + 1),
					}}
				>
					<img src={post.icon} alt="" class="size-12" />
					<hgroup class="flex flex-col gap-0.5">
						<p
							class="text-primary flex items-center gap-1.5 text-xs font-semibold uppercase"
						>
							{#if post.pinned}
								<PushpinFillMap class="size-3.5" />
								{m.pinned()}
							{:else}
								{#if wasPostedThisWeek(publishDate)}
									<StarFillSystem class="size-3.5" />
								{/if}
								{postedAt(publishDate)}
							{/if}
						</p>
						<h3 class="leading-5">
							{post.title}
						</h3>
					</hgroup>
				</a>
			{/each}
		{/if}
	</div>
</section>
