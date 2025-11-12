<script lang="ts">
	import { ArrowRightUpLineArrows } from "svelte-remix";
	import { m } from "$lib/paraglide/messages";
	import { SOCIALS, WORK } from "$lib/constants";
	import HeroDecorations from "./hero-decorations.svelte";
	import { browser, dev } from "$app/environment";
	import { onMount } from "svelte";
	import { elasticFly } from "$lib/utils/transitions";
	import { cn } from "$lib/utils";

	const PET_OFFSET = -32;

	let isPetting = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let scrollY = $state(0);

	let mounted = $state(!browser);
	let finishedAnimations = $state(false);

	onMount(() => {
		mounted = true;
		setTimeout(() => {
			finishedAnimations = true;
		}, 800);
	});
</script>

<svelte:window
	bind:scrollY
	onmousemove={(e) => {
		mouseX = e.clientX;
		mouseY = e.clientY - scrollY;
	}}
/>

{#if mounted}
	<section
		class="relative flex w-full flex-col justify-between py-6 md:flex-row md:py-24"
	>
		<HeroDecorations mode="dark" />
		<HeroDecorations mode="light" />

		<div class="relative z-0 flex flex-col">
			<h1
				in:elasticFly={{ opacity: 0, x: -24, duration: 800, delay: 100 }}
				class="max-w-[12ch] text-6xl/18 md:text-4xl lg:text-6xl/18"
			>
				{m.greetings()}
			</h1>
			<a
				href="/contact"
				class="border-b-primary text-primary hover:text-foreground hover:border-b-foreground group my-6 ml-auto flex w-fit gap-1.5 border-b pb-1 leading-5 font-medium transition-all md:mt-11 md:mr-24 md:mb-0"
				in:elasticFly={{
					opacity: 0,
					x: -24,
					duration: 800,
					delay: 200,
				}}
			>
				<span class="whitespace-pre">{m.lets_work_together()}</span>
				<ArrowRightUpLineArrows
					class="ease-elastic size-5 transition-all group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
				/>
			</a>
		</div>
		<figure
			class={cn(
				"relative z-0 mb-12 aspect-[4/5] w-full md:mb-0 md:w-60 md:scale-90 lg:scale-100",
				finishedAnimations && "group",
			)}
			oncontextmenu={(e) => {
				e.preventDefault();
				window.open(SOCIALS.instagram.url, "_blank");
			}}
		>
			<img
				src="/img/selfie.webp"
				alt=""
				class="ease-elastic-heavy relative z-20 rounded object-cover transition-all duration-800 group-hover:-translate-x-6 group-hover:translate-y-6 group-hover:-rotate-90"
				in:elasticFly={{
					opacity: 0,
					x: 24,
					y: -24,
					duration: 800,
				}}
			/>
			<span
				class="border-foreground/15 ease-elastic-heavy absolute top-0 left-0 z-30 size-full rounded border transition-all duration-800 group-hover:-translate-x-6 group-hover:translate-y-6 group-hover:-rotate-90"
				in:elasticFly={{
					opacity: 0,
					x: 24,
					y: -24,
					duration: 800,
				}}
			></span>
			<span
				class="border-primary ease-elastic absolute top-4 left-3 z-10 h-full w-[calc(100%-1.5rem)] rounded border duration-600 group-hover:-rotate-90 md:top-11 md:-left-11 md:w-full"
				in:elasticFly={{
					opacity: 0,
					x: 24,
					y: -24,
					duration: 800,
					delay: 100,
				}}
			></span>
			<span
				class="border-primary/50 ease-elastic absolute top-8 left-6 z-10 h-full w-[calc(100%-3rem)] rounded border transition-all duration-800 group-hover:top-16 group-hover:-left-16 group-hover:-rotate-90 md:top-[88px] md:left-[-88px] md:w-full"
				in:elasticFly={{
					opacity: 0,
					x: 24,
					y: -24,
					duration: 800,
					delay: 200,
				}}
			></span>
			<div
				class={cn(
					"ease-elastic absolute top-26 left-18 z-30 hidden h-8 w-20 rounded-t-full transition-all hover:cursor-none md:group-hover:block",
					dev && "border border-red-500/50",
				)}
				aria-hidden="true"
				onfocus={() => null}
				onmouseover={() => (isPetting = true)}
				onmouseleave={() => (isPetting = false)}
			></div>
		</figure>
		{#if isPetting}
			<img
				src="/img/pet.gif"
				alt=""
				class="pointer-events-none fixed z-20 size-16"
				style="left:{mouseX + PET_OFFSET}px;top:{mouseY + PET_OFFSET}px"
			/>
		{/if}
		<p
			class="text-body [&>span]:text-foreground [&>a]:text-foreground [&>a]:hover:text-primary relative z-0 mt-auto max-w-[27ch] translate-y-6 [&>a]:underline [&>a]:transition-all"
			in:elasticFly={{
				opacity: 0,
				x: 24,
				duration: 800,
				delay: 400,
			}}
		>
			{@html m.excerpt({
				companyName: WORK.company,
				companyUrl: WORK.url,
			})}
		</p>
	</section>
{/if}
