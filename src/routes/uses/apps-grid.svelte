<script lang="ts">
	import { browser } from "$app/environment";
	import { onVisible } from "$lib/utils/actions";
	import { elasticScale } from "$lib/utils/transitions";
	import { onMount } from "svelte";

	type Item = {
		icon: string;
		name: string;
		label: string;
	};

	let { label, items } = $props<{ label: string; items: Item[] }>();

	let mounted = $state(!browser);
	let visible = $state(!browser);

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div class="flex flex-col gap-6 md:flex-row md:gap-12">
		<h2
			class="text-body flex h-fit w-36 shrink-0 text-sm font-medium"
			use:onVisible={() => (visible = true)}
		>
			{label}
		</h2>
		<ul
			class="grid w-full grid-cols-3 gap-x-8 gap-y-8 md:gap-x-12 lg:grid-cols-5"
		>
			{#each items as item, i (i)}
				<li class="flex flex-col items-center text-center">
					{#if visible}
						<img
							src={item.icon}
							alt=""
							class="mb-1.5 size-14 rounded object-cover"
							in:elasticScale|global={{
								start: 0.9,
								duration: 800,
								delay: 50 * (i + 1),
							}}
						/>
					{:else}
						<div class="mb-1.5 size-14"></div>
					{/if}
					<p class="-mb-px leading-5">{item.name}</p>
					<p class="text-body flex shrink-0 text-xs">
						{item.label}
					</p>
				</li>
			{/each}
		</ul>
	</div>
{/if}
