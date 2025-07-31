<script lang="ts">
	import EmailButton from "$lib/components/common/email-button.svelte";
	import Prose from "$lib/components/common/prose.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import { SOCIALS, WHATSAPP } from "$lib/constants";
	import { m } from "$lib/paraglide/messages";
	import { ArrowRightUpLineArrows } from "svelte-remix";
	import BrazilFlag from "$lib/components/icons/brazil-flag.svg?component";
	import { browser } from "$app/environment";
	import { getLocale, setLocale } from "$lib/paraglide/runtime";

	const isPortugueseReader =
		browser &&
		navigator.languages.some((x) => x === "pt" || x.startsWith("pt-"));
</script>

<Seo title="Press Kit • Doce Fernandes" />

<svelte:head>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<hgroup class="mb-3 py-3 text-center md:mb-6 md:py-6">
	<p class="text-primary font-semibold tracking-widest uppercase">
		{m.presskit()}
	</p>
	<h1 class="text-5xl md:text-6xl">DoceAzedo</h1>
</hgroup>

<Prose>
	<div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
		<img
			class="col-span-2 m-0! w-full md:col-span-3"
			src="/img/me/dj-mira-hq.webp"
			alt=""
		/>
		<img class="m-0! w-full" src="/img/me/dj-lhamaday-closeup.webp" alt="" />
		<img class="m-0! w-full" src="/img/me/dj-balaio.webp" alt="" />
		<img
			class="m-0! hidden w-full md:block"
			src="/img/me/dj-mira-lq.webp"
			alt=""
		/>
	</div>
	<div class="col-span-3 mt-12 flex justify-center">
		<Button
			href="https://drive.google.com/drive/folders/1mE_tZIvcJvKfwnsS0bicXvkqvIPNd4or?usp=sharing"
			target="_blank"
			rel="noopener noreferrer"
			variant="link"
			class="group not-prose"
		>
			{m.all_hd_photos()}
			<ArrowRightUpLineArrows
				class="size-5 group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
			/>
		</Button>
	</div>

	<hr />

	<h2 class="flex items-center justify-between">
		{m.bio()}
		{#if getLocale() !== "pt" && isPortugueseReader}
			<Button
				onclick={() => setLocale("pt")}
				variant="outline"
				class="not-prose text-base font-medium"
			>
				<BrazilFlag class="size-5" />
				Também disponível em PT-BR!
			</Button>
		{/if}
	</h2>
	<p>{@html m.presskit_bio_intro()}</p>
	<p>{@html m.presskit_bio_experience()}</p>

	<!--
	<p
		class="relative flex flex-col justify-center md:-translate-x-12 md:flex-row"
	>
		<img
			src="/img/news-headline.webp"
			alt=""
			class="mb-0! ml-auto scale-90 opacity-80 md:w-2/3"
		/>
		<img
			src="/img/news-snippet.webp"
			alt=""
			class="not-prose z-10 -mt-24 ml-auto rounded md:absolute md:bottom-8 md:w-1/2"
		/>
	</p>
	-->

	<hr />

	<h2>{m.dj_sets_remixes()}</h2>

	<div class="grid gap-6 md:grid-cols-3">
		<div class="aspect-video md:col-span-2 md:row-span-2">
			<iframe
				class="size-full rounded border"
				src="https://www.youtube-nocookie.com/embed/4r81BjzM7bM?playlist=4r81BjzM7bM&loop=1"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>
		<iframe
			class="h-32 w-full rounded border md:h-full"
			title="SoundCloud audio player"
			scrolling="no"
			frameborder="no"
			src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2130026523&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true"
		></iframe>
		<iframe
			class="h-32 w-full rounded border md:h-full"
			title="SoundCloud audio player"
			scrolling="no"
			frameborder="no"
			src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1846080000&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true"
		></iframe>
	</div>

	<div class="mt-12 flex justify-end">
		<Button
			href={SOCIALS.soundcloud.url}
			target="_blank"
			variant="link"
			class="group not-prose"
		>
			{m.listen_on_soundcloud()}
			<ArrowRightUpLineArrows
				class="size-5 group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
			/>
		</Button>
	</div>

	<hr />

	<h2>{m.tech_rider()}</h2>
	<div class="not-prose grid md:grid-cols-3">
		<div class="flex flex-col items-center">
			<img src="/img/xdj-rx2.webp" alt="" class="opacity-50" />
			<p class="text-foreground -mb-1.5">XDJ-RX2 / XDJ-RR</p>
			<p class="text-body text-[85%]">{m.or_newer()}</p>
		</div>
		<p
			class="flex items-center justify-center text-center text-base font-medium"
		>
			<span
				class="before:bg-border after:bg-border text-muted-foreground/70 my-6 flex w-full items-center gap-6 text-[85%] uppercase before:h-px before:w-full after:h-px after:w-full md:my-0 md:text-[100%] md:before:bg-transparent md:after:bg-transparent"
			>
				{m.or()}
			</span>
		</p>
		<div class="flex flex-col items-center">
			<img src="/img/ddj-flx4.webp" alt="" class="opacity-50" />
			<p class="text-foreground -mb-1.5">DDJ-FLX4</p>
			<p class="text-body text-[85%]">{m.own_gear()}</p>
		</div>
	</div>

	<hr />

	<h2 class="text-center">{m.contact()}</h2>

	<div class="not-prose mx-auto flex max-w-lg flex-col gap-3">
		<EmailButton />
		{#each [WHATSAPP, SOCIALS.instagram, SOCIALS.soundcloud] as social}
			<Button
				href={social.url}
				target="_blank"
				rel="noopener noreferrer"
				variant="outline"
				size="lg"
			>
				<social.icon class="size-5" />
				{social.handle}
			</Button>
		{/each}
	</div>
</Prose>
