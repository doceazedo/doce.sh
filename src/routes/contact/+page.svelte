<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import Seo from "$lib/components/common/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import { SOCIALS } from "$lib/constants";
	import { CalendarScheduleLineBusiness } from "svelte-remix";
	import { getLocale } from "$lib/paraglide/runtime";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { elasticFly } from "$lib/utils/transitions";
	import EmailButton from "$lib/components/common/email-button.svelte";

	const CALL_URLS = {
		en: "https://cal.com/docef/chat",
		pt: "https://cal.com/docef/bate-papo",
	};

	let mounted = $state(!browser);
	onMount(() => (mounted = true));
</script>

<Seo title={m.contact_seo_title()} />

<hgroup class="py-3 md:py-12 md:text-center">
	<p class="text-primary mb-1.5 text-lg">
		{m.contact()}
	</p>
	<h1 class="flex flex-col gap-1.5 text-3xl md:items-center md:gap-0">
		<span>{m.contact_in_person_title()}</span>
		<span class="text-body text-2xl">{m.contact_email_title()}</span>
	</h1>
</hgroup>

{#if mounted}
	<div class="mx-auto flex max-w-lg flex-col gap-12">
		<EmailButton />

		<hr />

		<div class="flex flex-col gap-3">
			<h2 class="text-2xl">{m.contact_call_title()}</h2>
			<span
				class="flex w-full"
				in:elasticFly|global={{
					opacity: 0,
					y: 12,
					duration: 800,
					delay: 150,
				}}
			>
				<Button
					href={CALL_URLS[getLocale()]}
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
					size="lg"
					class="w-full"
				>
					<CalendarScheduleLineBusiness class="size-5" />
					{m.book_a_call()}
				</Button>
			</span>
		</div>

		<hr />

		<div class="flex flex-col gap-6">
			<hgroup>
				<h2 class="text-2xl">{m.contact_socials_title()}</h2>
				<p class="text-body">
					{m.contact_socials_subtitle()}
				</p>
			</hgroup>
			<ul class="grid grid-cols-2 gap-3">
				{#each Object.values(SOCIALS) as social, i (i)}
					<li
						in:elasticFly|global={{
							opacity: 0,
							y: 12,
							duration: 800,
							delay: 250 + i * 75,
						}}
					>
						<Button
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							variant="outline"
							size="lg"
							class="[&_svg]:fill-accent-foreground w-full [&_svg]:size-5"
						>
							{#if typeof social.icon === "string"}
								{@html social.icon}
							{:else}
								<social.icon class="size-5" />
							{/if}
							{social.label}
						</Button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
