<script lang="ts">
	import SectionTitleWithIcon from "$lib/components/common/section-title-with-icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { m } from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";
	import { onMount } from "svelte";
	import {
		ArrowRightUpLineArrows,
		BugFillDevelopment,
		EmotionNormalFillUserFaces,
	} from "svelte-remix";
	import { expoOut } from "svelte/easing";
	import { Tween } from "svelte/motion";

	type ErrorMessages = {
		[code: string]: string;
	};

	let { status }: { status: number } = $props();

	const CULPRITS: ErrorMessages = {
		"2xx": m.status_2xx_culprit(),
		"3xx": m.status_3xx_culprit(),
		"4xx": m.status_4xx_culprit(),
		"5xx": m.status_5xx_culprit(),
		unknown: m.status_unknown_culprit(),
	};

	const STATUS_DESCRIPTIONS: ErrorMessages = {
		"200": m.status_200_description(),
		"201": m.status_201_description(),
		"202": m.status_202_description(),
		"204": m.status_204_description(),
		"206": m.status_206_description(),
		"300": m.status_300_description(),
		"301": m.status_301_description(),
		"302": m.status_302_description(),
		"303": m.status_303_description(),
		"304": m.status_304_description(),
		"307": m.status_307_description(),
		"308": m.status_308_description(),
		"400": m.status_400_description(),
		"401": m.status_401_description(),
		"402": m.status_402_description(),
		"403": m.status_403_description(),
		"404": m.status_404_description(),
		"405": m.status_405_description(),
		"406": m.status_406_description(),
		"407": m.status_407_description(),
		"408": m.status_408_description(),
		"409": m.status_409_description(),
		"410": m.status_410_description(),
		"411": m.status_411_description(),
		"413": m.status_413_description(),
		"414": m.status_414_description(),
		"415": m.status_415_description(),
		"417": m.status_417_description(),
		"418": m.status_418_description(),
		"420": m.status_420_description(),
		"421": m.status_421_description(),
		"422": m.status_422_description(),
		"425": m.status_425_description(),
		"429": m.status_429_description(),
		"431": m.status_431_description(),
		"451": m.status_451_description(),
		"500": m.status_500_description(),
		"501": m.status_501_description(),
		"502": m.status_502_description(),
		"503": m.status_503_description(),
		"504": m.status_504_description(),
		"505": m.status_505_description(),
		unknown: m.status_unknown_description(),
	};

	const FAQ = [
		{
			icon: BugFillDevelopment,
			title: m.error_think_its_a_bug_title(),
			description: m.error_think_its_a_bug_description(),
			actionLabel: m.open_an_issue(),
			actionUrl: "https://github.com/doceazedo/doce.sh/issues/new",
		},
		{
			icon: EmotionNormalFillUserFaces,
			title: m.error_what_is_that_title({
				statusCodeFirst2Digits: status
					.toString()
					.split("")
					.slice(0, 2)
					.join("-"),
			}),
			description: m.error_what_is_that_description(),
			actionLabel: m.learn_more_on_mdn(),
			actionUrl: `https://developer.mozilla.org/${getLocale() === "pt" ? "pt-BR" : "en-US"}/docs/Web/HTTP/Reference/Status/${status}`,
		},
	];

	const tweenedStatusCode = new Tween(100, {
		duration: 1500,
		easing: expoOut,
	});

	onMount(() => {
		tweenedStatusCode.target = status;
	});
</script>

<main class="flex flex-col items-center gap-12">
	<div
		class="grid w-[calc(4.5rem*3)] grid-cols-3 gap-x-2 py-24 md:w-[calc(6.5rem*3)] md:py-48"
	>
		<div class="border-primary relative flex justify-center border-b">
			<span class="bg-primary absolute -bottom-3 left-0 h-3 w-px"></span>
			<span class="bg-primary absolute right-0 -bottom-3 h-3 w-px"></span>
			<span class="bg-primary absolute bottom-0 h-3 w-px"></span>
			<p
				class="[&>span]:text-primary mb-3.5 text-center text-sm/4 md:text-base/5"
			>
				{@html STATUS_DESCRIPTIONS?.[`${status}`]
					? CULPRITS?.[`${status.toString()[0]}xx`]
					: CULPRITS.unknown}
			</p>
		</div>
		<div class="col-span-2"></div>
		{#each Math.floor(tweenedStatusCode.current).toString().split("") as digit}
			<div class="flex justify-center text-9xl md:text-[12rem]/[100%]">
				{digit}
			</div>
		{/each}
		<div></div>
		<div
			class="border-primary relative col-span-2 flex justify-center border-t"
		>
			<span class="bg-primary absolute -top-3 left-0 h-3 w-px"></span>
			<span class="bg-primary absolute -top-3 right-0 h-3 w-px"></span>
			<span class="bg-primary absolute top-0 h-3 w-px"></span>
			<p class="mt-3.5 text-center text-sm/4 md:text-base/5">
				{@html STATUS_DESCRIPTIONS?.[`${status}`] ||
					STATUS_DESCRIPTIONS.unknown}
			</p>
		</div>
	</div>

	<div class="grid w-full grid-cols-1 gap-24 md:grid-cols-2 lg:gap-48">
		{#each FAQ as card}
			<div class="flex flex-col gap-3 xl:pl-[2.75rem]">
				<SectionTitleWithIcon icon={card.icon} title={card.title} />
				<p class="text-body mb-3 md:pl-[2.75rem] xl:pl-0">
					{card.description}
				</p>
				<Button
					href={card.actionUrl}
					target="_blank"
					variant="link"
					class="mt-auto w-fit md:ml-[2.75rem] xl:ml-0 hover:[&_svg]:-translate-y-0.75"
				>
					{card.actionLabel}
					<ArrowRightUpLineArrows class="size-5" />
				</Button>
			</div>
		{/each}
	</div>
</main>
