<script lang="ts">
	import { cn } from "$lib/utils";

	const COLORS = ["#FCF434", "#FFFFFF", "#9C59D1", "#2C2C2C"];
	const NUM_OF_COLUMNS = 10;
	const STAGGERED_DELAY = 100;
	const BILLOW = 2;

	const firstColumnDelay = NUM_OF_COLUMNS * STAGGERED_DELAY * -1;

	const generateGradientString = (colors: string[]) => {
		const segmentHeight = 100 / colors.length;
		const gradientStops = colors.map((color, index) => {
			const from = index * segmentHeight;
			const to = (index + 1) * segmentHeight;
			return `${color} ${from}% ${to}%`;
		});
		return `linear-gradient(to bottom, ${gradientStops.join(", ")})`;
	};
</script>

<div class={cn("flag flex h-5 w-[30px] md:h-8 md:w-[50px]")}>
	{#each Array(NUM_OF_COLUMNS) as _, index (index)}
		<div
			class="column flex flex-1 flex-col"
			style:--billow="{BILLOW}px"
			style:background={generateGradientString(COLORS)}
			style:animation-delay="{firstColumnDelay + index * STAGGERED_DELAY}ms"
		></div>
	{/each}
</div>

<style>
	@keyframes oscillate {
		from {
			transform: translateY(var(--billow));
		}
		to {
			transform: translateY(calc(var(--billow) * -1));
		}
	}

	.flag {
		animation-duration: 600ms;
	}

	.column {
		animation: oscillate 500ms alternate infinite ease-in-out both;
	}
</style>
