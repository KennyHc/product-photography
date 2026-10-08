import type { Lang } from '../i18n/ui';

/**
 * Builds a base-aware href for an internal, language-aware path.
 *
 * `path` should be the un-prefixed, English-style path, e.g. "/", "/work",
 * "/work/sample-ecommerce", "/about", "/contact". This helper prepends the
 * Astro BASE_URL (e.g. "/product-photography/") and, for non-English locales,
 * the locale prefix (e.g. "/es").
 */
export function href(path: string, lang: Lang = 'en'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path === '/' ? '' : path;
  const localePrefix = lang === 'en' ? '' : `/${lang}`;
  const full = `${base}${localePrefix}${normalized}`;
  return full === '' ? '/' : full;
}

/** Absolute URL (including site origin) for use in OG tags / hreflang links. */
export function absoluteUrl(path: string, lang: Lang = 'en'): string {
  const site = import.meta.env.SITE ?? '';
  return `${site}${href(path, lang)}`;
}
