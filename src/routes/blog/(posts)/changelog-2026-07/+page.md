---
title: "I love websites with sidebars!"
date: "2026/07/15"
icon: "/img/icons/dizzy-emoji.svg"
---

And that's true!

When I'm browsing someone's personal website, I probably want to explore all their pages, and I feel like a sidebar helps much better than a navbar at doing so. There is so much more real estate that links don't feel cramped. The vertical nature of it makes it feel like a checklist as I visit each page.

I also really like narrow web pages. My website always had a considerably small `max-width`. It easier for reading, it's easier to handle breakpoints, and it feels so charming!

A sidebar, naturally, makes it easier to narrow a web page width while adding some content to the previously empty sides.

## Design updates

It's been a few years since I wanted my website to feel more like a personal page rather than a CV or portfolio, so I tweaked a few things...

### Sidebar

Most notably, of course, is the **sidebar**. Links are now vertical, my socials and currently playing music are not hidden on the footer anymore which I really like:

<img src="/img/blog/changelog-2026-07/sidebar.webp" class="w-48 mx-auto" />

### Home

I reordered a lot of sections as well to better feature my personal stuff. On the homepage, posts now come before my projects which are now smaller.

### Gachapon

The gacha machine now gets it's own page instead of living inside a dialog to make it more like a fun page and less like a minor easter egg (you will still have to find it yourself, it's very easy to tho):

![](/img/blog/changelog-2026-07/slash-gachapon.webp)

### /me

The [/me](/me) page got some love as well. The TL;DR was feeling to dashboard-y, the text was whatever and my cats were absent from this page. I separated and reordered some sections to better highlight each. Go and see this one yourself!

### /now

The [/now](/now) page got a small update. The "current focus" section was too bulky and hard to read, so I renamed it to "daily life" and made it generally more compact. On the right side, I added a [status.cafe](https://status.cafe) widget thingy inspired by Victorious:

<div class="grid md:grid-cols-2 gap-6">
  <img src="/img/blog/changelog-2026-07/now-update.webp" class="m-0!" />
  <img src="/img/blog/changelog-2026-07/the-slap-update.webp" class="m-0!" />
</div>

## Hosting

It's been a while since I moved away from Cloudflare to **bunny.net** as my DNS provider, after two Cloudflare outages brought down the entire internet.

Recently I also moved away from Vercel to bunny's Magic Containers for hosting, after Vercel decided my website was getting too much traffic and disabling all my projects.

Bunny is also based in Slovenia, which is nice if you would rather not depend on US infrastructure for everything...

I hope more people move away from Cloudflare as time goes by so the web can become more decentralized and avoid a single point of failure taking down 70% of the internet.

Anyways... I already had [Pocketbase](https://pocketbase.io/) running on my home server, and I now also self-host [Plausible](https://plausible.io), which I was already using for privacy-friendly analytics.
