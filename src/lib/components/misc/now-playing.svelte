<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { LAST_PLAYED_TRACKS } from "$lib/stores";
	import type { LastPlayedTracksRecord } from "$lib/pocketbase-types";

	let currentTrack = $derived<LastPlayedTracksRecord | null>(
		$LAST_PLAYED_TRACKS?.[0] || null,
	);
</script>

{#if currentTrack}
	<Button
		variant="ghost"
		href="/now"
		class="hover:bg-muted group relative mx-auto h-fit w-fit flex-row justify-start gap-2 rounded-xs p-2 transition-all md:w-full md:border"
	>
		<img
			src={currentTrack.cover_url}
			alt=""
			class="bg-muted size-10 rounded-xs"
		/>
		<hgroup class="grow overflow-hidden text-left">
			<p class="text-body -mb-0.5 truncate text-xs">
				{currentTrack.artist}
			</p>
			<p class="truncate text-sm font-medium">
				{currentTrack.track}
			</p>
		</hgroup>
		{#if currentTrack.now_playing}
			<div
				class="absolute top-1 left-[42px] flex size-2.5 items-center justify-center"
			>
				<span
					class="group-hover:border-muted border-background absolute size-full rounded-full border-2 bg-red-500 transition-all"
				></span>
				<span
					class="border-background animation-duration-[2s] absolute size-2 animate-ping rounded-full bg-red-500 opacity-80 transition-all"
				></span>
			</div>
		{/if}
	</Button>
{/if}
