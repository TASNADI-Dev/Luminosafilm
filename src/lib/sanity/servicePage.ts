// Fetches and normalizes localized service page content from Sanity.
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'
import {type Locale, type ServiceId, services} from '../i18n'
import {urlFor} from './image'
import {SERVICE_PAGE_BY_ID_QUERY} from './queries'

export interface ServiceHeroImage {
	_key: string
	alt?: string
	url: string
}

export interface ServiceHero {
	heading: string
	paragraph: string
	images: ServiceHeroImage[]
}

export interface ServicePageContent {
	serviceId: ServiceId
	title: string
	slug: string
	hero: ServiceHero
}

interface ServiceHeroImageQuery {
	_key?: string
	alt?: string
	hotspot?: unknown
	crop?: unknown
	asset?: {
		_id: string
		url: string
	}
}

interface ServicePageQueryResult {
	heading?: string
	paragraph?: string
	images?: ServiceHeroImageQuery[]
}

const defaultHeroParagraphByLocale: Record<Locale, string> = {
	hu: 'Body medium Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	en: 'Body medium Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

/** Fixed Sanity document IDs for each catalog service (must match Studio structure). */
export function servicePageDocumentId(serviceId: ServiceId): string {
	return `servicePage-${serviceId}`
}

function buildDefaultHero(locale: Locale, title: string): ServiceHero {
	return {
		heading: title,
		paragraph: defaultHeroParagraphByLocale[locale],
		images: [],
	}
}

function resolveHeroImageUrl(image: ServiceHeroImageQuery): string | undefined {
	if (!image.asset?._id) {
		return undefined
	}

	return urlFor({
		asset: {_ref: image.asset._id},
		hotspot: image.hotspot,
		crop: image.crop,
	} as SanityImageSource)
		.width(468)
		.height(342)
		.fit('crop')
		.auto('format')
		.url()
}

function normalizeHero(
	result: ServicePageQueryResult | null,
	locale: Locale,
	fallbackTitle: string,
): ServiceHero {
	if (!result?.heading || !result.paragraph) {
		return buildDefaultHero(locale, fallbackTitle)
	}

	const images = (result.images ?? [])
		.map((image, index) => {
			const url = resolveHeroImageUrl(image)
			if (!url) {
				return null
			}

			return {
				_key: image._key || `image-${index + 1}`,
				alt: image.alt,
				url,
			}
		})
		.filter((image): image is ServiceHeroImage => image !== null)

	return {
		heading: result.heading,
		paragraph: result.paragraph,
		images,
	}
}

function buildPage(locale: Locale, serviceId: ServiceId, hero: ServiceHero): ServicePageContent {
	const service = services.find((entry) => entry.id === serviceId)!

	return {
		serviceId,
		title: service.labels[locale],
		slug: service.slugs[locale],
		hero,
	}
}

export function getServicePageSlugs(locale: Locale): string[] {
	return services.map((service) => service.slugs[locale])
}

export async function getServicePageBySlug(
	locale: Locale,
	slug: string,
): Promise<ServicePageContent | null> {
	const catalogEntry = services.find((service) => service.slugs[locale] === slug)
	if (!catalogEntry) {
		return null
	}

	const title = catalogEntry.labels[locale]

	try {
		const result = await sanityClient.fetch<ServicePageQueryResult | null>(
			SERVICE_PAGE_BY_ID_QUERY,
			{
				documentId: servicePageDocumentId(catalogEntry.id),
				locale,
			},
		)

		return buildPage(locale, catalogEntry.id, normalizeHero(result, locale, title))
	} catch {
		return buildPage(locale, catalogEntry.id, buildDefaultHero(locale, title))
	}
}
