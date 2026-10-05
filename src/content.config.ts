import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    pubDate: z.coerce.date().optional().default(() => new Date()),
    updatedDate: z.coerce.date().nullable().optional(),
    tags: z.array(z.string()).nullable().optional().transform((val) => val ?? []),
    draft: z.boolean().nullable().optional().transform((val) => val ?? false),
    cover: z.string().nullable().optional().transform((val) => val ?? undefined),
  }),
});

export const collections = { blog };
