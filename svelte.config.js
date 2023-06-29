import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const autolinkHeadings = () =>
  rehypeAutolinkHeadings({
    behavior: 'append',
    properties: {
      class: 'heading-link'
    },
    content: {
      type: 'text',
      value: linkIcon
    }
  });

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  extensions: ['.svelte', '.md'],
  preprocess: [
    mdsvex({
      extensions: ['.md'],
      layout: 'src/lib/components/layout/single-post.svelte',
      rehypePlugins: [rehypeSlug, autolinkHeadings]
    }),
    preprocess()
  ],

  kit: {
    adapter: adapter()
  }
};

const linkIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="m18.36 15.54-1.41-1.42 1.41-1.41a5 5 0 1 0-7.07-7.08L9.88 7.05 8.46 5.64l1.42-1.42a7 7 0 0 1 9.9 9.9l-1.42 1.42zm-2.82 2.82-1.42 1.42a7 7 0 0 1-9.9-9.9l1.42-1.42 1.41 1.42-1.41 1.41a5 5 0 1 0 7.07 7.08l1.41-1.42 1.42 1.42zm-.71-10.6 1.41 1.41-7.07 7.07-1.41-1.41 7.07-7.07z"/>
  </svg>
`;

export default config;
