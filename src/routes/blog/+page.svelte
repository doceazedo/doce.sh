<script lang="ts">
	import { browser } from "$app/environment";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
	import { postedAt, wasPostedThisWeek } from "$lib/utils/date";
	import { elasticFly } from "$lib/utils/transitions.js";
	import { onMount } from "svelte";
	import { StarFillSystem } from "svelte-remix";

	let { data } = $props();

	let mounted = $state(!browser);
	onMount(() => (mounted = true));
</script>

<Seo title={m.articles_seo_title()} />

<div class="flex flex-col gap-12">
	<PageTitle title={m.articles()} subtitle={m.articles_subtitle()} />
	<ul class="flex flex-col gap-12">
		{#if mounted}
			{#each data.postsByYear as yearPosts, i}
				{@const year = new Date(yearPosts[0].date).getFullYear()}
				{@const previousPostsDelay =
					data.postsByYear.slice(0, i).flat().length * 50}

				<li class="flex flex-col gap-3">
					<h3
						class="text-body text-2xl md:text-3xl"
						in:elasticFly|global={{
							opacity: 0,
							y: 24,
							duration: 800,
							delay: previousPostsDelay + 50 * i,
						}}
					>
						{year}
					</h3>
					{#each yearPosts as post, j}
						{@const publishDate = new Date(`${post.date} GMT-3`)}
						<a
							href="/blog/{post.slug}"
							class="ease-elastic hover:before:bg-primary/5 dark:hover:before:bg-primary/10 hover:before:border-primary relative flex items-center gap-3 rounded border p-6 transition-all before:absolute before:top-0 before:left-0 before:-z-10 before:size-full before:rounded before:border before:border-transparent before:transition-all hover:-translate-y-1.5"
							in:elasticFly|global={{
								opacity: 0,
								y: 24,
								duration: 800,
								delay: previousPostsDelay + 50 * (j + 1),
							}}
						>
							<img src={post.icon} alt="" class="size-12" />
							<hgroup class="flex flex-col gap-0.5">
								<p
									class="text-primary flex items-center gap-1.5 text-xs font-semibold uppercase"
								>
									{#if wasPostedThisWeek(publishDate)}
										<StarFillSystem class="size-3.5" />
									{/if}
									{postedAt(publishDate)}
								</p>
								<h3 class="leading-5">
									{post.title}
								</h3>
							</hgroup>
						</a>
					{/each}
				</li>
			{/each}
		{/if}
	</ul>
</div>
