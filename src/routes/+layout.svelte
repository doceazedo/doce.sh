<script lang="ts">
	import "../app.css";
	import "../prism-theme-github-light.css";
	import "../prism-theme-github-dark.css";
	import { cn } from "$lib/utils";
	import Footer from "$lib/components/layout/footer.svelte";
	import { m } from "$lib/paraglide/messages";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from "svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import GlobalState from "$lib/components/misc/global-state.svelte";
	import { toast } from "svelte-sonner";
	import { playAudio } from "$lib/audio";
	import NoiseOverlay from "$lib/components/misc/noise-overlay.svelte";
	import { Loader2LineSystem } from "svelte-remix";
	import Sidebar from "$lib/components/layout/sidebar.svelte";

	let { children } = $props();
	
	let mounted = $state(false);

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key.toLowerCase() !== "b") return;
		if (document.querySelector("input:focus")) return;

		playAudio("bus-horn");
		toast.success(m.thanks_bus_driver());
	};

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:window onkeydown={handleKeyPress} />

<ModeWatcher defaultMode="dark" disableTransitions={false} />
<Toaster richColors position="top-right" />
<GlobalState />

<div class="flex w-full max-w-7xl mx-auto relative">
	<Sidebar />
	<div class="w-full p-6 pt-0 mt-16 md:p-12 md:mt-0 md:ml-64">
		{@render children()}
		<Footer />
	</div>
</div>

<div
	class={cn(
		"bg-background text-body fixed top-0 left-0 z-50 flex size-full cursor-wait items-center justify-center gap-1.5 transition-all duration-100",
		mounted && "pointer-events-none opacity-0 select-none",
	)}
>
	<Loader2LineSystem class="text-primary size-6 animate-spin" />
	{m.loading()}
</div>

<NoiseOverlay />
