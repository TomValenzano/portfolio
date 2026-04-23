import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const projectSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  category: z.enum(['work', 'studies']),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  period: z.string().optional(),
  featured: z.boolean().default(false),
  summary: z.string().optional(),
  order: z.number().default(0),
  links: z.object({
    live: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
})

export default defineContentConfig({
  collections: {
    projects_it: defineCollection({
      type: 'page',
      source: 'projects/it/**/*.md',
      schema: projectSchema,
    }),
    projects_en: defineCollection({
      type: 'page',
      source: 'projects/en/**/*.md',
      schema: projectSchema,
    }),
  },
})
