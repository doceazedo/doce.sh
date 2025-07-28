<script lang="ts">
	import EmailButton from "$lib/components/common/email-button.svelte";
	import Prose from "$lib/components/common/prose.svelte";
	import Seo from "$lib/components/common/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import { SOCIALS, WHATSAPP } from "$lib/constants";
	import { m } from "$lib/paraglide/messages";
	import { ArrowRightUpLineArrows, WhatsappLineLogos } from "svelte-remix";
</script>

<Seo title="Press Kit • Doce Fernandes" />

<hgroup class="mb-3 py-3 text-center md:mb-6 md:py-6">
	<p class="text-primary font-semibold tracking-widest uppercase">Press Kit</p>
	<h1 class="text-5xl md:text-6xl">DoceAzedo</h1>
</hgroup>

<Prose>
	<div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
		<img
			class="col-span-2 m-0! w-full md:col-span-3"
			src="/img/me/dj-mira-hq.webp"
			alt=""
		/>
		<img class="m-0! w-full" src="/img/me/dj-mira-lq.webp" alt="" />
		<img class="m-0! w-full" src="/img/me/dj-balaio.webp" alt="" />
		<img
			class="m-0! hidden w-full md:block"
			src="/img/me/dj-lhamaday-closeup.webp"
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
			Galeria de fotos em HD
			<ArrowRightUpLineArrows
				class="size-5 group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
			/>
		</Button>
	</div>

	<hr />

	<h2>Bio</h2>
	<p>
		DJ não-binárie da Grande BH, <strong>DoceAzedo</strong> foge do seu dia a
		dia como programador para se juntar à cena efervescente de Belo Horizonte,
		misturando os sons mais eletrizantes do underground local. Host do programa
		<a
			href="https://www.instagram.com/embrazamaisjoga"
			target="_blank"
			rel="noopener noreferrer">Combo EMBRAZA + JOGA</a
		>
		na web rádio independente
		<a
			href="https://www.instagram.com/function.fm"
			target="_blank"
			rel="noopener noreferrer">FUNCTION!</a
		>, sua sonoridade viaja entre UKG, Drum & Bass e tantas vertentes do Baile
		Funk.
	</p>
	<p>
		Diretamente de Pedro Leopodo - MG, <strong>Doce</strong> chega até a capital
		mineira para construir sua identidade enquanto DJ, passando por festas e
		espaços onde já viveu tantas noites, dessa vez agora para discotecar, como
		na
		<a
			href="https://www.instagram.com/festatrophy"
			target="_blank"
			rel="noopener noreferrer">Festa Trophy</a
		>,
		<a
			href="https://www.instagram.com/kaofunk"
			target="_blank"
			rel="noopener noreferrer">Kaô Funk</a
		>,
		<a
			href="https://www.instagram.com/mira_beaga"
			target="_blank"
			rel="noopener noreferrer">MIRA!</a
		>
		e
		<a
			href="https://www.instagram.com/clubecontra"
			target="_blank"
			rel="noopener noreferrer">Contra</a
		>
		(Juíz de Fora - MG).
	</p>

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

	<h2>DJ sets & remixes</h2>

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
			Ouvir no SoundCloud
			<ArrowRightUpLineArrows
				class="size-5 group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
			/>
		</Button>
	</div>

	<hr />

	<h2>Rider técnico</h2>
	<div class="not-prose grid md:grid-cols-3">
		<div class="flex flex-col items-center">
			<img src="/img/xdj-rx2.webp" alt="" class="opacity-50" />
			<p class="text-foreground -mb-1.5">XDJ-RX2 / XDJ-RR</p>
			<p class="text-body text-[85%]">ou mais recente</p>
		</div>
		<p
			class="flex items-center justify-center text-center text-base font-medium"
		>
			<span
				class="before:bg-border after:bg-border text-muted-foreground/70 my-6 flex w-full items-center gap-6 text-[85%] uppercase before:h-px before:w-full after:h-px after:w-full md:my-0 md:text-[100%] md:before:bg-transparent md:after:bg-transparent"
			>
				ou
			</span>
		</p>
		<div class="flex flex-col items-center">
			<img src="/img/ddj-flx4.webp" alt="" class="opacity-50" />
			<p class="text-foreground -mb-1.5">DDJ-FLX4</p>
			<p class="text-body text-[85%]">(equipamento próprio)</p>
		</div>
	</div>

	<hr />

	<h2 class="text-center">Contato</h2>

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
