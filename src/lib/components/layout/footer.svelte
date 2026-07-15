<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import ElevatorUp from "$lib/components/icons/elevator-up.svg?component";
	import { cn } from "$lib/utils";
	import Memoji from "$lib/components/misc/memoji.svelte";
	import { SOCIALS } from "$lib/constants";
	import { getLocale } from "$lib/paraglide/runtime";
	import { sineOut } from "svelte/easing";
	import { pauseAudio, playAudio } from "$lib/audio";
	import { MAKE_ELEVATOR_FASTER } from "$lib/settings";
	import { RssLineDevice } from "svelte-remix";
	import NowPlaying from "../misc/now-playing.svelte";

	const FOOTER_SOCIALS = [
		{
			icon: RssLineDevice,
			url: "/feed",
		},
		SOCIALS.github,
		SOCIALS.bluesky,
		SOCIALS.discord,
		SOCIALS.instagram,
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
</script>

<svelte:window bind:scrollY bind:innerHeight />
<svelte:body bind:clientHeight />

<footer
	class="mt-12 mb-6 flex flex-col justify-between gap-6 border-t py-12 text-center md:pt-6 md:pb-0 md:mb-0"
>
	<div class="text-body flex flex-col items-center text-sm">
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

	<div class="text-body mx-auto mt-auto flex translate-y-1.5 md:hidden">
		{#each FOOTER_SOCIALS as social}
			<a
				href={social.url}
				target="_blank"
				class={cn(
					"hover:text-foreground ease-elastic p-1.5 transition-all ",
				)}
			>
				<social.icon class="size-6 transition-all" />
			</a>
		{/each}
	</div>

	<div class="block md:hidden">
		<NowPlaying />
	</div>
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
