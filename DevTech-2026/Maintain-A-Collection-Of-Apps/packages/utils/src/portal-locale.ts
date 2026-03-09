// Utilities to derive a locale from an ArcGIS portal object and apply it to the ArcGIS JS API.
// The main exported functions are:
// - `_calculateLocale(portal)`: synchronously derive a best-effort locale string from `portal` (checks portal.culture, portal.user.culture, navigator.language)
// - `setLocaleFromPortal(portal)`: async helper that uses `@arcgis/core/intl` to normalize and set the JSAPI locale

export function _calculateLocale(portal?: any): string {
  const navLang = typeof navigator !== 'undefined' ? navigator.language : null;
  // Prefer explicit user culture from the portal's signed-in user object when present
  const userCulture = portal?.user?.culture;
  if (userCulture) {
    return userCulture;
  }

  // Next prefer the browser language if available
  if (navLang) {
    return navLang;
  }
  // Finally fall back to the portal-level culture, or 'en' as a last resort
  return portal?.culture || 'en';
}

// Normalize a locale string into a simple canonical form, e.g. "en_us" -> "en-US".
export function calculateLocale(locale?: string | null): string {
  if (!locale || typeof locale !== 'string') return 'en';
  const s = locale.trim().replace(/_/g, '-');
  const parts = s.split('-').filter(Boolean);
  if (parts.length === 0) return 'en';
  const language = parts[0].toLowerCase();
  if (parts.length === 1) return language;
  const region = parts[1].toUpperCase();
  return `${language}-${region}`;
}

export async function setLocaleFromPortal(portal?: any): Promise<string> {
  const locale = _calculateLocale(portal);

  const normalized = calculateLocale(locale);
  // Always set the document `lang` attribute so assistive tech and browsers know the page language.
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized;
  }

  // Determine if the locale should use RTL layout.
  let prefersRtl: boolean | null = null;
  try {
    const intl = await import('@arcgis/core/intl');
 
      prefersRtl = !!intl.prefersRTL(normalized);

  } catch {
    // ignore import failures and fall back to heuristic
  }

  if (prefersRtl === null) {
    const lang = normalized.split('-')[0];
    const rtlLangs = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'syr', 'dv']);
    prefersRtl = rtlLangs.has(lang);
  }

  if (typeof document !== 'undefined') {
    document.documentElement.dir = prefersRtl ? 'rtl' : 'ltr';
  }

  return normalized;
}
