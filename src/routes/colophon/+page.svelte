<script lang="ts">
	import Prose from "$lib/components/common/prose.svelte";
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
	import {
		CodeLineDevelopment,
		CodeSSlashLineDevelopment,
		CpuLineDevice,
		FileCodeLineDocument,
		FileCopyLineDocument,
		Heart3FillHealthMedical,
		HistoryFillSystem,
		LineChartLineBusiness,
		MarkdownLineDocument,
		PencilRuler2FillDesign,
		PlugFillOthers,
		RemixiconLineLogos,
		ServerLineDevice,
		Translate2Editor,
	} from "svelte-remix";
	import List from "./list.svelte";
	import {
		siCloudflare,
		siDiscogs,
		siFigma,
		siFortnite,
		siLastdotfm,
		siMapbox,
		siShadcnui,
		siSimpleicons,
		siSteam,
		siSvelte,
		siSvg,
		siTailwindcss,
		siVercel,
		siBluesky,
		siMastodon,
		siReddit,
		siPocketbase,
	} from "simple-icons";
	import { getLocale } from "$lib/paraglide/runtime";
	import { Button } from "$lib/components/ui/button";
	import Threlte from "$lib/components/icons/threlte.svg?component";
	import Deezer from "$lib/components/icons/deezer.svg?component";
	import PageTitle from "$lib/components/common/page-title.svelte";
	import { cn } from "$lib/utils";
</script>

<Seo title={m.colophon_seo_title()} />

<div class="flex flex-col gap-12">
	<PageTitle title={m.colophon()} subtitle={m.colophon_subtitle()} />

	<SectionTitleWithIcon
		icon={CodeSSlashLineDevelopment}
		title={m.tech_stack()}
		subtitle={m.tech_stack_subtitle()}
	/>
	<Prose>
		<List
			items={[
				{
					label: "SvelteKit",
					description: m.js_framework_description(),
					icon: siSvelte.svg,
					url: "https://svelte.dev",
				},
				{
					label: "Tailwind",
					description: m.css_framework_description(),
					icon: siTailwindcss.svg,
					url: "https://tailwindcss.com",
				},
				{
					label: "shadcn-svelte",
					description: m.shadcnui_description(),
					icon: siShadcnui.svg,
					url: "https://shadcn-svelte.com",
				},
				{
					label: "Remix Icon",
					description: m.icons_library_description(),
					icon: RemixiconLineLogos,
					url: "https://remixicon.com",
				},
				{
					label: "Simple Icons",
					description: m.brand_icons_library_description(),
					icon: siSimpleicons.svg,
					url: "https://simpleicons.org",
				},
				{
					label: "Paraglide JS",
					description: m.i18n_library_description(),
					icon: Translate2Editor,
					url: "https://mdsvex.pngwn.io",
				},
				{
					label: "Threlte",
					description: m.threejs_description(),
					icon: Threlte,
					url: "https://threlte.xyz",
				},
				{
					label: "MDsveX",
					description: m.mdx_description(),
					icon: MarkdownLineDocument,
					url: "https://mdsvex.pngwn.io",
				},
				{
					label: "Satori",
					description: m.satori_description(),
					icon: siSvg.svg,
					url: "https://github.com/vercel/satori",
				},
				{
					label: "Mapbox",
					description: m.map_embed_description(),
					icon: siMapbox.svg,
					url: "https://www.mapbox.com",
				},
			]}
		/>
	</Prose>

	<hr />

	<SectionTitleWithIcon
		icon={ServerLineDevice}
		title={m.hosting()}
		subtitle={m.hosting_subtitle()}
	/>
	<Prose>
		<List
			items={[
				{
					label: "Vercel",
					description: m.web_hosting_description(),
					icon: siVercel.svg,
					url: "https://vercel.com",
				},
				{
					label: "CloudFlare",
					description: m.dns_description(),
					icon: siCloudflare.svg,
					url: "https://cloudflare.com",
				},
			]}
		/>
		<p
			class="[&_svg]:fill-body [&_svg]:group-hover:fill-primary [&_svg]:size-4 [&_svg]:transition-all [&>a]:inline-flex [&>a]:translate-y-0.5 [&>a]:items-center [&>a]:gap-1"
		>
			{@html m.pocketbase_description({ icon: siPocketbase.svg })}
		</p>
	</Prose>

	<hr />

	<SectionTitleWithIcon
		icon={PlugFillOthers}
		title={m.third_party_apis()}
		subtitle={m.third_party_apis_subtitle()}
	/>
	<Prose>
		<List
			items={[
				{
					label: "Last.fm",
					description: m.lastfm_api_description(),
					icon: siLastdotfm.svg,
					url: "https://www.last.fm/api",
				},
				{
					label: "Deezer",
					description: m.deezer_api_description(),
					icon: Deezer,
					url: "https://developers.deezer.com/api",
				},
				{
					label: "Discogs",
					description: m.discogs_api_description(),
					icon: siDiscogs.svg,
					url: "https://www.discogs.com/developers",
				},
				{
					label: "Steam",
					description: m.steam_api_description(),
					icon: siSteam.svg,
					url: "https://steamcommunity.com/dev",
				},
				{
					label: "Fortnite-API",
					description: m.fortnite_api_description(),
					icon: siFortnite.svg,
					url: "https://dash.fortnite-api.com",
				},
				{
					label: "Bluesky",
					description: m.backfeeding_api_description(),
					icon: siBluesky.svg,
					url: "https://docs.bsky.app",
				},
				{
					label: "Mastodon",
					description: m.backfeeding_api_description(),
					icon: siMastodon.svg,
					url: "https://docs.joinmastodon.org/client/intro",
				},
				{
					label: "Reddit",
					description: m.backfeeding_api_description(),
					icon: siReddit.svg,
					url: "https://www.reddit.com/dev/api",
				},
			]}
		/>
	</Prose>

	<hr />

	<SectionTitleWithIcon icon={LineChartLineBusiness} title={m.analytics()} />
	<Prose>
		{@html m.analytics_description()}
	</Prose>

	<hr />

	<SectionTitleWithIcon icon={CpuLineDevice} title={m.ai_usage()} />

	<Prose>
		{@html m.ai_usage_summary()}
	</Prose>

	<hr />

	<SectionTitleWithIcon icon={PencilRuler2FillDesign} title={m.design()} />
	<Prose
		class="prose-h3:font-normal prose-h3:text-xl md:prose-h3:text-2xl [&_svg]:fill-body [&_svg]:group-hover:fill-primary prose-a:inline-flex prose-a:translate-y-0.5 prose-a:items-center prose-a:gap-1 [&_svg]:size-4 [&_svg]:transition-all"
	>
		<p>
			{@html m.design_description({
				technology: `${siFigma.svg} Figma`,
			})}
		</p>
		<h3>{m.overall_design()}</h3>
		<p>{m.overall_design_description()}</p>
		<img src="/img/colophon/figma-zoomed-out-screenshot.webp" alt="" />
		{@html m.overall_design_details()}
		<h3>{m.key_principles()}</h3>
		{@html m.key_principles_description()}
		<h3>{m.pages_vs_blog_posts()}</h3>
		{@html m.pages_vs_blog_posts_description()}
	</Prose>

	<hr />

	<SectionTitleWithIcon
		icon={HistoryFillSystem}
		title={m.previous_versions()}
	/>
	<Prose class="prose-h3:font-normal prose-h3:text-xl md:prose-h3:text-2xl">
		<div
			class="ease-elastic not-prose group flex cursor-default items-center justify-between rounded border p-3 transition-all hover:-translate-y-1"
		>
			<div class="flex flex-col gap-px">
				<p class="font-semibold">🎉 Initial commit!</p>
				<div class="text-body flex items-center gap-1.5 text-sm">
					<img src="/img/avatar.jpg" alt="" class="size-5 rounded-full" />
					{m.committed_on({
						author: "DoceAzedo",
						date: new Date("2021-09-12T22:59:59.000Z").toLocaleDateString(
							getLocale(),
							{
								dateStyle: "medium",
							},
						),
					})}
				</div>
			</div>
			<div class="hidden md:flex">
				<Button
					href="https://github.com/doceazedo/doce.sh/commit/41868455226b6a99155355e10255cfa4fecfe1f9"
					target="_blank"
					size="sm"
					variant="ghost"
					class="text-body">1c5fdad</Button
				>
				<Button
					href=""
					target="_blank"
					size="sm"
					variant="ghost"
					class="text-body"
				>
					<FileCopyLineDocument />
				</Button>
				<Button
					href="https://github.com/doceazedo/doce.sh/blob/1c5fdad5086898afca61ece21ac2632c2b02fb87/README.md"
					target="_blank"
					size="sm"
					variant="ghost"
					class="text-body"
				>
					<FileCodeLineDocument />
				</Button>
				<Button
					href="https://github.com/doceazedo/doce.sh/tree/1c5fdad5086898afca61ece21ac2632c2b02fb87"
					target="_blank"
					size="sm"
					variant="ghost"
					class="text-body"
				>
					<CodeLineDevelopment />
				</Button>
			</div>
		</div>
		<p>{m.previous_versions_description()}</p>

		<h3>2022-2024</h3>
		<p>{m.previous_versions_v2022()}</p>
		<img src="/img/colophon/lp-2024.webp" alt="" />

		<h3>2021</h3>
		<p>{m.previous_versions_v2021()}</p>
		<img src="/img/colophon/lp-2021.webp" alt="" />
	</Prose>

	<hr />

	<SectionTitleWithIcon
		icon={Heart3FillHealthMedical}
		title={m.acknowledgements()}
	/>
	<Prose>
		<List
			items={[
				{
					label: "IndieWeb",
					description: m.acknowledgements_indieweb(),
					url: "https://indieweb.org",
				},
				{
					label: "Damola Morenikeji",
					description: m.acknowledgements_damola(),
					url: "https://www.bydamo.la/p/ai-manifesto",
				},
				{
					label: "Tania Rascia's website",
					description: m.acknowledgements_taniarascia(),
					url: "https://www.taniarascia.com/",
				},
				{
					label: "Jarema's website",
					description: m.acknowledgements_jarema(),
					url: "https://jarema.me",
				},
				{
					label: "João Pescada's website",
					description: m.acknowledgements_joao_pescada(),
					url: "https://joaopescada.com",
				},
				{
					label: "Josh W. Comeau's website",
					description: m.acknowledgements_josh_comeau(),
					url: "https://joshwcomeau.com/about-josh",
				},
				{
					label: "Bulk Resize Photos",
					description: m.acknowledgements_bulk_resize_photos(),
					url: "https://bulkresizephotos.com",
				},
				{
					label: "cobalt's privacy policy",
					description: m.acknowledgements_cobalt(),
					url: "https://cobalt.tools/about/privacy",
				},
				{
					label: "Toby Fox",
					description: m.acknowledgements_toby_fox(),
					url: "https://twitter.com/tobyfox",
				},
			]}
		/>
	</Prose>
</div>
