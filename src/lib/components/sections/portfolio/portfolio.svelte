<script lang="ts">
	import {
		siSvelte,
		siKotlin,
		siFfmpeg,
		siPocketbase,
		siRust,
		siGodotengine,
		siFlutter,
		siSupabase,
		siBackblaze,
	} from "simple-icons";
	import { m } from "$lib/paraglide/messages";
	import PortfolioItem from "./portfolio-item.svelte";
	import type { Project } from "$lib/types";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	let workProjects = $state<{ [id: string]: Project }>({
		afterparty: {
			pretitle: m.portfolio_afterparty_pretitle(),
			title: m.portfolio_afterparty_title(),
			description: m.portfolio_afterparty_description(),
			thumbnail: "/img/portfolio/afterparty-lp.webp",
			stack: [siSvelte, siPocketbase, siFfmpeg, siBackblaze],
			role: m.portfolio_afterparty_role(),
			details: m.portfolio_afterparty_details(),
			links: [{ label: m.website(), url: "https://afterparty.fm" }],
			media: [
				{
					url: "/img/portfolio/afterparty-dashboard.webp",
					label: m.portfolio_afterparty_media_dashboard(),
				},
				{
					url: "/img/portfolio/afterparty-lp-mockup.webp",
					label: m.portfolio_afterparty_media_lp(),
				},
				{
					url: "/img/portfolio/afterparty-mobile.webp",
					label: m.portfolio_afterparty_media_mobile(),
				},
				{
					url: "https://www.youtube-nocookie.com/embed/AxXJ--N4OJE?si=dZpl0j1tBN8sVPnH&loop=1&playlist=AxXJ--N4OJE",
					label: m.portfolio_afterparty_media_demo(),
				},
			],
		},
		godotWry: {
			pretitle: m.portfolio_godot_wry_pretitle(),
			title: m.portfolio_godot_wry_title(),
			description: m.portfolio_godot_wry_description(),
			thumbnail: "/img/portfolio/godot-wry-cas.webp",
			video: "/video/portfolio/godot-wry-demo.mp4",
			stack: [siRust, siGodotengine],
			role: m.portfolio_godot_wry_role(),
			details: m.portfolio_godot_wry_details(),
			links: [
				{ label: m.website(), url: "https://godot-wry.doceazedo.com" },
				{
					label: m.source_code(),
					url: "https://github.com/doceazedo/godot_wry",
				},
			],
			media: [
				{
					url: "/img/portfolio/godot-wry-docs.webp",
					label: m.portfolio_godot_wry_media_docs(),
				},
				{
					url: "/img/portfolio/godot-wry-transparent-webview.webp",
					label: m.portfolio_godot_wry_media_simple_demo(),
				},
				{
					url: "https://www.youtube-nocookie.com/embed/cqKBvl5a1-o?si=PM7I2T4YPH4q6Fvv&loop=1&playlist=cqKBvl5a1-o",
					label: m.portfolio_godot_wry_media_cas(),
				},
			],
		},
		powershift: {
			pretitle: m.portfolio_powershift_pretitle(),
			title: m.portfolio_powershift_title(),
			description: m.portfolio_powershift_description(),
			thumbnail: "/img/portfolio/powershift-mobile.webp",
			stack: [siFlutter, siSvelte, siSupabase],
			role: m.portfolio_powershift_role(),
			details: m.portfolio_powershift_details(),
			links: [],
			media: [
				{
					url: "/img/portfolio/powershift-mobile-shift.webp",
					label: m.portfolio_powershift_media_mobile(),
				},
				{
					url: "/img/portfolio/powershift-mobile-data.webp",
					label: m.portfolio_powershift_media_mobile_data(),
				},
				{
					url: "/img/portfolio/powershift-dashboard.webp",
					label: m.portfolio_powershift_media_dashboard(),
				},
				{
					url: "https://www.youtube-nocookie.com/embed/7JoObeG6SKo?si=BY3KKMNDSMfIP8Kw&loop=1&playlist=7JoObeG6SKo",
					label: m.portfolio_powershift_media_devlog(),
				},
			],
			visible: false,
		},
		ssn: {
			pretitle: m.portfolio_ssn_pretitle(),
			title: m.portfolio_ssn_title(),
			description: m.portfolio_ssn_description(),
			thumbnail: "/img/ssn-bee.webp",
			stack: [siKotlin, siPocketbase],
			role: m.portfolio_ssn_role(),
			details: m.portfolio_ssn_details(),
			links: [
				{ label: m.website(), url: "https://ssn.gg" },
				{ label: m.source_code(), url: "https://github.com/doceazedo/ssn" },
			],
			media: [
				{ url: "/img/ssn-trans-bee.webp", label: "" },
				{ url: "/img/ssn-deep-dark.webp", label: "" },
				{ url: "/img/ssn-withers.webp", label: "" },
				{ url: "/img/ssn-halloween-jack.webp", label: "" },
				{ url: "/img/ssn-coffofin-bees.webp", label: "" },
			],
			visible: false,
		},
		gachapon: {
			pretitle: m.portfolio_gachapon_pretitle(),
			title: m.portfolio_gachapon_title(),
			description: m.portfolio_gachapon_description(),
			thumbnail: "",
			stack: ["✨", "💫", "🔮"],
			role: "",
			details: "",
			links: [],
			media: [],
			visible: false,
		},
	});

	let mounted = $state(!browser);
	onMount(() => (mounted = true));
</script>

<section class="relative z-0 flex flex-col gap-12 py-12 md:py-24">
	<h2 class="text-4xl">
		{m.select_work()}
		<span class="text-primary">/</span>
		{m.case_studies()}
	</h2>

	{#if mounted}
		<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12">
			<li class="md:col-span-2">
				<PortfolioItem project={workProjects.afterparty} />
			</li>
			<li class="md:col-span-2 xl:-ml-32 xl:w-7xl">
				<PortfolioItem project={workProjects.godotWry} direction="row" />
			</li>
			<li>
				<PortfolioItem project={workProjects.powershift} type="mobile" />
			</li>
			<li class="">
				<PortfolioItem project={workProjects.gachapon} type="gachapon" />
			</li>
		</ul>
	{/if}
</section>
