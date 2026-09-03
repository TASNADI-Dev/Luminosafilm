// Locale types and helpers for hu (default) / en routing and chrome copy.
export type Locale = 'hu' | 'en';

export const defaultLocale: Locale = 'hu';
export const locales: Locale[] = ['hu', 'en'];

/** Astro/Vite base URL (e.g. `/Luminosafilm/` on GitHub Pages). Always ends with `/`. */
export const baseUrl = import.meta.env.BASE_URL;

export function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

/** Prepends the configured base URL to a site path. */
export function withBase(path: string): string {
	const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	if (!path || path === '/') return base;
	const normalized = path.startsWith('/') ? path.slice(1) : path;
	return `${base}${normalized}`;
}

/** Removes the configured base URL from a pathname (e.g. from `Astro.url.pathname`). */
export function stripBase(pathname: string): string {
	const base = baseUrl.replace(/\/$/, '');
	if (base && pathname.startsWith(base)) {
		const rest = pathname.slice(base.length);
		if (!rest || rest === '/') return '/';
		return rest.startsWith('/') ? rest : `/${rest}`;
	}
	return pathname || '/';
}

/** Home path for a locale (`/` for hu, `/en/` for en), including base URL. */
export function localeHomePath(locale: Locale): string {
	return withBase(locale === defaultLocale ? '/' : `/${locale}/`);
}

/**
 * Maps the current path to the equivalent path in another locale.
 * Hungarian lives at `/…`; English under `/en/…`.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
	const sitePath = stripBase(pathname);
	const normalized =
		sitePath.endsWith('/') && sitePath !== '/' ? sitePath.slice(0, -1) : sitePath;
	const withoutEn = normalized.replace(/^\/en(?=\/|$)/, '') || '/';

	if (target === 'en') {
		if (withoutEn === '/') return withBase('/en/');
		return withBase(`/en${withoutEn}${sitePath.endsWith('/') ? '/' : ''}`);
	}

	return withBase(withoutEn === '/' ? '/' : `${withoutEn}${sitePath.endsWith('/') ? '/' : ''}`);
}

export interface NavLink {
	href: string;
	label: string;
}

export interface NavItem extends NavLink {
	children?: NavLink[];
}

const servicesChildrenHu: NavLink[] = [
	{ href: '#dokumentumfilmek', label: 'Dokumentumfilmek' },
	{ href: '#oral-history', label: 'Oral history' },
	{ href: '#promocios-filmek', label: 'Promóciós filmek' },
	{ href: '#civil-szervezetek-bemutatasa', label: 'Civil szervezetek bemutatása' },
	{ href: '#oktatas', label: 'Oktatás' },
	{ href: '#palyazatiras-es-megvalositas', label: 'Pályázatírás és megvalósítás' },
	{ href: '#eszkozberles', label: 'Eszközbérlés' },
];

const servicesChildrenEn: NavLink[] = [
	{ href: '#documentaries', label: 'Documentaries' },
	{ href: '#oral-history', label: 'Oral history' },
	{ href: '#promotional-films', label: 'Promotional films' },
	{ href: '#ngo-presentations', label: 'NGO presentations' },
	{ href: '#education', label: 'Education' },
	{ href: '#grant-writing-and-implementation', label: 'Grant writing and implementation' },
	{ href: '#equipment-rental', label: 'Equipment rental' },
];

export const navItems: Record<Locale, NavItem[]> = {
	hu: [
		{ href: '#szolgaltatasok', label: 'Szolgáltatások', children: servicesChildrenHu },
		{ href: '#referenciak', label: 'Referenciák' },
		{ href: '#rolunk', label: 'Rólunk' },
		{ href: '#kapcsolat', label: 'Kapcsolat' },
	],
	en: [
		{ href: '#services', label: 'Services', children: servicesChildrenEn },
		{ href: '#references', label: 'References' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' },
	],
};

/** Hardcoded hero CTA targets per locale (not Sanity-editable). */
export const heroButtonHref: Record<Locale, string> = {
	hu: '#kapcsolat',
	en: '#contact',
};

/** Hardcoded why-choose-us CTA targets per locale (not Sanity-editable). */
export const whyChooseUsButtonHref: Record<Locale, { primary: string; secondary: string }> = {
	hu: { primary: '#kapcsolat', secondary: '#referenciak' },
	en: { primary: '#contact', secondary: '#references' },
};

export const navUi = {
	hu: {
		homeAria: 'Luminosa Film kezdőlap',
		menuOpen: 'Menü megnyitása',
		menuClose: 'Menü bezárása',
		submenuOpen: 'Almenü megnyitása',
		submenuClose: 'Almenü bezárása',
	},
	en: {
		homeAria: 'Luminosa Film home',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		submenuOpen: 'Open submenu',
		submenuClose: 'Close submenu',
	},
} as const satisfies Record<Locale, Record<string, string>>;
