// Fetches and normalizes localized service page content from Sanity.
import {sanityClient} from 'sanity:client'
import {
	type Locale,
	type ServiceId,
	isServiceId,
	services,
} from '../i18n'
import {SERVICE_PAGE_BY_SLUG_QUERY, SERVICE_PAGES_SLUGS_QUERY} from './queries'

export interface ServicePageContent {
	serviceId: ServiceId
	title: string
	slug: string
}

interface ServicePageQueryResult {
	serviceId?: string
	title?: string
	slug?: string
}

interface ServiceSlugResult {
	slug?: string
	serviceId?: string
}

function buildFallbackPage(locale: Locale, serviceId: ServiceId): ServicePageContent {
	const service = services.find((entry) => entry.id === serviceId)!

	return {
		serviceId,
		title: service.labels[locale],
		slug: service.slugs[locale],
	}
}

export async function getServicePageSlugs(locale: Locale): Promise<string[]> {
	const catalogSlugs = services.map((service) => service.slugs[locale])

	try {
		const results = await sanityClient.fetch<ServiceSlugResult[]>(SERVICE_PAGES_SLUGS_QUERY, {
			locale,
		})
		const cmsSlugs = results.map((entry) => entry.slug).filter((slug): slug is string => Boolean(slug))
		return Array.from(new Set([...catalogSlugs, ...cmsSlugs]))
	} catch {
		return catalogSlugs
	}
}

export async function getServicePageBySlug(
	locale: Locale,
	slug: string,
): Promise<ServicePageContent | null> {
	const catalogEntry = services.find((service) => service.slugs[locale] === slug)

	try {
		const result = await sanityClient.fetch<ServicePageQueryResult | null>(
			SERVICE_PAGE_BY_SLUG_QUERY,
			{locale, slug},
		)

		if (result?.title && result.slug) {
			const serviceId =
				result.serviceId && isServiceId(result.serviceId)
					? result.serviceId
					: catalogEntry?.id

			if (!serviceId) {
				return null
			}

			return {
				serviceId,
				title: result.title,
				slug: result.slug,
			}
		}
	} catch {
		// Fall through to catalog fallback.
	}

	if (!catalogEntry) {
		return null
	}

	return buildFallbackPage(locale, catalogEntry.id)
}
