<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import ElevatorUp from "$lib/components/icons/elevator-up.svg?component";
	import { cn } from "$lib/utils";
	import Memoji from "$lib/components/misc/memoji.svelte";
	import { LAST_PLAYED_TRACKS } from "$lib/stores";
	import { SOCIALS } from "$lib/constants";
	import { getLocale } from "$lib/paraglide/runtime";
	import { sineOut } from "svelte/easing";
	import { pauseAudio, playAudio } from "$lib/audio";
	import { MAKE_ELEVATOR_FASTER } from "$lib/settings";
	import type { LastPlayedTracksRecord } from "$lib/pocketbase-types";

	const FOOTER_SOCIALS = [
		SOCIALS.github,
		SOCIALS.linkedin,
		SOCIALS.bluesky,
		SOCIALS.instagram,
		SOCIALS.discord,
		SOCIALS.soundcloud,
	];

	const COPYLEFT_URL = {
		en: "https://www.gnu.org/licenses/copyleft.en.html",
		pt: "https://www.gnu.org/licenses/copyleft.pt-br.html",
	};

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let clientHeight = $state(1080);

	let scrolledTo = $derived(scrollY + innerHeight);
	let scrolledToBottom = $derived(scrolledTo >= clientHeight - 24);
	let scrollSpeed = $derived($MAKE_ELEVATOR_FASTER ? 1000 : 600);

	const scrollToTop = () => {
		playAudio(
			$MAKE_ELEVATOR_FASTER ? "can-you-really-call-this-a-hotel" : "hotel",
		);

		const startPosition = window.pageYOffset;
		const distance = startPosition;
		const duration = Math.max((distance / scrollSpeed) * 1000, 300);
		let startTime: number | null = null;

		const animation = (currentTime: number) => {
			if (startTime === null) startTime = currentTime;

			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);
			const easeProgress = sineOut(progress);

			const currentPosition: number = startPosition - distance * easeProgress;
			window.scrollTo(0, currentPosition);

			if (progress < 1) {
				requestAnimationFrame(animation);
				return;
			}

			pauseAudio("can-you-really-call-this-a-hotel");
			pauseAudio("hotel");

			playAudio("chime");
		};

		requestAnimationFrame(animation);
	};

	let currentTrack = $derived<LastPlayedTracksRecord | null>(
		$LAST_PLAYED_TRACKS?.[0] || null,
	);
</script>

<svelte:window bind:scrollY bind:innerHeight />
<svelte:body bind:clientHeight />

<footer
	class="mt-12 mb-6 flex flex-col justify-between gap-6 border-t py-12 text-center md:flex-row md:pt-6 md:pb-0 md:text-left"
>
	<div class="text-body flex flex-col items-center text-sm md:items-start">
		<Memoji class="mb-1.5 size-14" />
		<p class="-mb-1.5">
			<a
				href={COPYLEFT_URL[getLocale()]}
				target="_blank"
				class="hover:text-primary inline-flex -translate-y-0.75 rotate-180"
			>
				&copy;
			</a>
			{new Date().getFullYear()} Doce Fernandes.
		</p>
		<p>{m.licensed_under({ license: "GPLv3" })}</p>
	</div>

	<div class="text-body mx-auto mt-auto flex translate-y-1.5">
		{#each FOOTER_SOCIALS as social, i}
			<a
				href={social.url}
				target="_blank"
				class={cn(
					"hover:text-foreground ease-elastic p-1.5 transition-all hover:scale-115",
					i % 2 ? "hover:rotate-6" : "hover:-rotate-6",
				)}
			>
				<social.icon class="size-6 transition-all" />
			</a>
		{/each}
	</div>

	{#if currentTrack}
		<a
			href="/now"
			class="hover:bg-muted group relative mx-auto mt-auto flex h-fit flex-row-reverse items-center gap-2 rounded-xs p-1 transition-all hover:shadow-[0_0_0_4px_var(--muted)] md:mx-0 md:translate-1 md:flex-row"
		>
			<hgroup class="text-left md:text-right">
				<p class="text-body -mb-1 text-xs">
					{currentTrack.artist}
				</p>
				<p class="text-sm font-medium">
					{currentTrack.track}
				</p>
			</hgroup>
			<img
				src={currentTrack.cover_url}
				alt=""
				class="bg-muted size-10 rounded"
			/>
			{#if currentTrack.now_playing}
				<div
					class="absolute top-0 left-10 flex size-2.5 items-center justify-center md:right-0 md:left-auto"
				>
					<span
						class="group-hover:border-muted border-background absolute size-full rounded-full border-2 bg-red-500 transition-all"
					></span>
					<span
						class="border-background animation-duration-[2s] absolute size-2 animate-ping rounded-full bg-red-500 opacity-80 transition-all"
					></span>
				</div>
			{/if}
		</a>
	{/if}
</footer>

<button
	class={cn(
		"text-body hover:text-foreground ease-elastic pointer-events-none fixed right-0 bottom-0 translate-y-3 cursor-pointer p-3 opacity-0 transition-all hover:scale-115 md:p-6",
		scrolledToBottom && "pointer-events-auto translate-y-0 opacity-100",
	)}
	onclick={scrollToTop}
>
	<ElevatorUp class="transition-all" />
</button>
