import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string(),
  client: z.string().optional(),
  category: z.enum(['ecommerce', 'lifestyle', 'still-life']),
  shots: z.array(z.enum(['white', 'lifestyle', 'flatlay', 'detail'])).optional(),
  date: z.string(),
  summary: z.string(),
  order: z.number(),
  testimonial: z
    .object({
      quote: z.string(),
      author: z.string(),
    })
    .optional(),
});

const projectsEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects/en' }),
  schema: projectSchema,
});

const projectsEs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects/es' }),
  schema: projectSchema,
});

export const collections = { projectsEn, projectsEs };
