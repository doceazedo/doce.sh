<script lang="ts">
	import {
		ArrowLeftLineArrows,
		ArrowRightLineArrows,
		ShuffleLineMedia,
	} from "svelte-remix";
	import Button from "../ui/button/button.svelte";

	const WEBRING_BASE_URL = "https://webringue.com";
</script>

<div class="flex max-w-3xs gap-1.5">
	<Button
		variant="outline"
		href="{WEBRING_BASE_URL}/doce/anterior"
		class="size-8"
	>
		<ArrowLeftLineArrows />
	</Button>
	<Button variant="ghost" size="sm" href={WEBRING_BASE_URL} class="grow">
		<img src="/img/icons/webringue.webp" alt="" class="size-4" />
		webringue
	</Button>
	<Button
		variant="outline"
		size="sm"
		href="{WEBRING_BASE_URL}/doce/aleatorio"
		class="size-8"
	>
		<ShuffleLineMedia />
	</Button>
	<Button
		variant="outline"
		size="sm"
		href="{WEBRING_BASE_URL}/doce/proximo"
		class="size-8"
	>
		<ArrowRightLineArrows />
	</Button>
</div>
