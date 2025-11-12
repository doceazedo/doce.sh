<script lang="ts">
	import Seo from "$lib/components/common/seo.svelte";
	import { m } from "$lib/paraglide/messages";
	import { onMount } from "svelte";
	import AppsGrid from "./apps-grid.svelte";
	import ProductsGrid from "./products-grid.svelte";
	import { browser } from "$app/environment";
	import { elasticScale } from "$lib/utils/transitions";
	import PageTitle from "$lib/components/common/page-title.svelte";

	const PC_PARTS = [
		{ label: m.uses_cpu(), product: "AMD Ryzen 7 7700X" },
		{ label: m.uses_gpu(), product: "Gigabyte RTX 5070 Ti" },
		{ label: m.uses_mobo(), product: "Gigabyte B650M" },
		{ label: m.uses_ram(), product: "32GB (2×16) Crucial DDR5 5600MHz" },
		{
			label: m.uses_rom(),
			product: "2TB Crucial NVMe SSD + 480GB Crucial SATA SSD",
		},
		{ label: m.uses_psu(), product: "Cooler Master GX Gold 850" },
		{ label: m.uses_case(), product: "NZXT H5 Flow" },
		{ label: m.uses_cooling(), product: "NZXT Kraken 240 RGB Water Cooler" },
	];

	const PERIPHERALS = [
		{
			image: "/img/uses/display.webp",
			label: m.uses_display(),
			product: "Gigabyte M27Q",
		},
		{
			image: "/img/uses/keyboard.webp",
			label: m.uses_keyboard(),
			product: "Keychron K10 Pro (Brown)",
		},
		{
			image: "/img/uses/mouse.webp",
			label: m.uses_mouse(),
			product: "Logitech MX Master 3S",
		},
		{
			image: "/img/uses/drawing-tablet.webp",
			label: m.uses_drawing_tablet(),
			product: "Wacom CTL472",
		},
		{
			image: "/img/uses/webcam.webp",
			label: m.uses_webcam(),
			product: "Logitech C922",
		},
		{
			image: "/img/uses/deskmat.webp",
			label: m.uses_deskmat(),
			product: "Kumori Speed Vissotto (90×40cm)",
		},
	];

	const AUDIO = [
		{
			image: "/img/uses/speakers.webp",
			label: m.uses_speakers_office(),
			product: "Edifier R1280DB",
		},
		{
			image: "/img/uses/speakers-2.webp",
			label: m.uses_speakers_home(),
			product: "Edifier S360DB",
		},
		{
			image: "/img/uses/headphones.webp",
			label: m.uses_headphones(),
			product: "AirPods Max",
		},
		{
			image: "/img/uses/microphone.webp",
			label: m.uses_microphone(),
			product: "HyperX QuadCast",
		},
		{
			image: "/img/uses/audio-interface.webp",
			label: m.uses_audio_interface(),
			product: "Focusrite Scarlett 2i2",
		},
		{
			image: "/img/uses/earbuds.webp",
			label: m.uses_earbuds(),
			product: "AirPods Pro 2",
		},
		{
			image: "/img/uses/turntable.webp",
			label: m.uses_turntable(),
			product: "Audio-Technica LP70XBT",
		},
	];

	const DEVELOPMENT_SOFTWARE = [
		{
			icon: "/img/uses/vscode.webp",
			name: "VS Code",
			label: m.uses_code_editor(),
		},
		{
			icon: "/img/uses/intellij.webp",
			name: "IntelliJ IDEA",
			label: m.uses_kotlin_ide(),
		},
		{
			icon: "/img/uses/rustrover.webp",
			name: "RustRover",
			label: m.uses_rust_ide(),
		},
		{
			icon: "/img/uses/warp.webp",
			name: "Warp",
			label: m.uses_terminal(),
		},
		{
			icon: "/img/uses/new-moon.webp",
			name: "New Moon",
			label: m.uses_theme(),
		},
	];

	const GENERAL_SOFTWARE = [
		{
			icon: "/img/uses/firefox.webp",
			name: "Firefox",
			label: m.uses_browser(),
		},
		{
			icon: "/img/uses/spotify.webp",
			name: "Spotify",
			label: m.uses_music_streaming(),
		},
		{
			icon: "/img/uses/bitwarden.webp",
			name: "Bitwarden",
			label: m.uses_password_manager(),
		},
		{
			icon: "/img/uses/mullvad.webp",
			name: "Mullvad",
			label: m.uses_vpn(),
		},
		{
			icon: "/img/uses/docs.webp",
			name: "Google Docs",
			label: m.uses_documents(),
		},
		{
			icon: "/img/uses/powerpoint.webp",
			name: "PowerPoint",
			label: m.uses_slides(),
		},
		{
			icon: "/img/uses/mega.webp",
			name: "MEGA",
			label: m.uses_cloud(),
		},
		{
			icon: "/img/uses/obsidian.webp",
			name: "Obsidian",
			label: m.uses_notes(),
		},
		{
			icon: "/img/uses/raycast.webp",
			name: "Raycast",
			label: m.uses_app_launcher(),
		},
		{
			icon: "/img/uses/cleanshotx.webp",
			name: "CleanShot X",
			label: m.uses_screenshots(),
		},
		{
			icon: "/img/uses/screenstudio.webp",
			name: "Screen Studio",
			label: m.uses_screen_recorder(),
		},
		{
			icon: "/img/uses/capcut.webp",
			name: "CapCut",
			label: m.uses_video_editor(),
		},
	];

	const DESIGN_SOFTWARE = [
		{
			icon: "/img/uses/figma.webp",
			name: "Figma",
			label: m.uses_ui_design(),
		},
		{
			icon: "/img/uses/illustrator.webp",
			name: "Illustrator",
			label: m.uses_vector_editor(),
		},
		{
			icon: "/img/uses/photopea.webp",
			name: "Photopea",
			label: m.uses_bitmap_editor(),
		},
	];

	const MUSIC_SOFTWARE = [
		{
			icon: "/img/uses/flstudio.webp",
			name: "FL Studio 21",
			label: m.uses_daw(),
		},
		{
			icon: "/img/uses/rekordbox.webp",
			name: "Rekordbox",
			label: m.uses_djing(),
		},
	];

	let mounted = $state(!browser);

	onMount(() => (mounted = true));
</script>

<Seo title={m.uses_seo_title()} />

<PageTitle title={m.thing_i_use()} />

<div class="mt-6 flex flex-col gap-6 md:gap-12">
	{#if mounted}
		<figure
			class="bg-muted relative aspect-video w-full rounded before:absolute before:size-full before:rounded before:border before:border-white/10"
			in:elasticScale|global={{
				start: 0.9,
				duration: 800,
			}}
		>
			<img
				src="/img/uses/setup.webp"
				alt=""
				class="aspect-video w-full rounded object-cover"
			/>
		</figure>
	{/if}
	<hr />
	<ProductsGrid
		label={m.uses_main_pc()}
		items={[{ product: 'M1 MacBook Pro 14" 2021' }]}
	/>
	<hr />
	<ProductsGrid label={m.uses_gaming_pc()} items={PC_PARTS} />
	<hr />
	<ProductsGrid label={m.uses_peripherals()} items={PERIPHERALS} />
	<hr />
	<ProductsGrid label={m.uses_audio()} items={AUDIO} />
	<hr />
	<AppsGrid
		label={m.uses_development_software()}
		items={DEVELOPMENT_SOFTWARE}
	/>
	<hr />
	<AppsGrid label={m.uses_general_software()} items={GENERAL_SOFTWARE} />
	<hr />
	<AppsGrid label={m.uses_design_software()} items={DESIGN_SOFTWARE} />
	<hr />
	<AppsGrid label={m.uses_music_software()} items={MUSIC_SOFTWARE} />
</div>
