import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projectsEn'> | CollectionEntry<'projectsEs'>;

/** The locale's projects, sorted by `order`. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries: Project[] = await getCollection(lang === 'es' ? 'projectsEs' : 'projectsEn');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Previous and next project, wrapping around. */
export function getPrevNext(projects: Project[], id: string): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.id === id);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
