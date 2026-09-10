// Fetches and normalizes localized service page content from Sanity.
import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'
import {type Locale, type ServiceId, services} from '../i18n'
import {urlFor} from './image'
import {SERVICE_PAGE_BY_ID_QUERY} from './queries'
import {extractYoutubeId} from './youtube'

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

export interface ServiceFeatureRows {
	heading: string
	paragraph: PortableTextBlock[]
}

export interface ServiceRelatedReference {
	_key: string
	title: string
	videoUrl: string
	youtubeId: string
}

export interface ServicePageContent {
	serviceId: ServiceId
	title: string
	slug: string
	hero: ServiceHero
	featureRows?: ServiceFeatureRows
	relatedReferences?: ServiceRelatedReference[]
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

interface ServiceRelatedReferenceQuery {
	_key?: string
	title?: string
	videoUrl?: string
}

interface ServicePageQueryResult {
	heading?: string
	paragraph?: string
	images?: ServiceHeroImageQuery[]
	featureRows?: {
		heading?: string
		paragraph?: PortableTextBlock[] | string
	}
	relatedReferences?: {
		items?: ServiceRelatedReferenceQuery[]
	}
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

function resolveImageUrl(
	image: ServiceHeroImageQuery,
	width: number,
	height: number,
): string | undefined {
	if (!image.asset?._id) {
		return undefined
	}

	return urlFor({
		asset: {_ref: image.asset._id},
		hotspot: image.hotspot,
		crop: image.crop,
	} as SanityImageSource)
		.width(width)
		.height(height)
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
			const url = resolveImageUrl(image, 468, 342)
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

function paragraphBlock(text: string, key: string): PortableTextBlock {
	return {
		_type: 'block',
		_key: key,
		style: 'normal',
		markDefs: [],
		children: [
			{
				_type: 'span',
				_key: `${key}-span`,
				text,
				marks: [],
			},
		],
	}
}

function toPortableText(
	value: PortableTextBlock[] | string | undefined,
): PortableTextBlock[] | undefined {
	if (Array.isArray(value) && value.length > 0) {
		return value
	}

	if (typeof value === 'string' && value.trim()) {
		return value
			.split(/\n+/)
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line, index) => paragraphBlock(line, `feature-rows-paragraph-${index}`))
	}

	return undefined
}

function normalizeFeatureRows(
	result: ServicePageQueryResult | null,
): ServiceFeatureRows | undefined {
	const section = result?.featureRows
	const paragraph = toPortableText(section?.paragraph)
	if (!section?.heading || !paragraph) {
		return undefined
	}

	return {
		heading: section.heading,
		paragraph,
	}
}

function normalizeRelatedReferences(
	result: ServicePageQueryResult | null,
): ServiceRelatedReference[] | undefined {
	const items = result?.relatedReferences?.items
	if (!items?.length) {
		return undefined
	}

	const normalized = items
		.map((item, index) => {
			if (!item.title || !item.videoUrl) {
				return null
			}

			const youtubeId = extractYoutubeId(item.videoUrl)
			if (!youtubeId) {
				return null
			}

			return {
				_key: item._key || `reference-${index + 1}`,
				title: item.title,
				videoUrl: item.videoUrl,
				youtubeId,
			}
		})
		.filter((item): item is ServiceRelatedReference => item !== null)

	return normalized.length > 0 ? normalized : undefined
}

function buildPage(
	locale: Locale,
	serviceId: ServiceId,
	hero: ServiceHero,
	featureRows?: ServiceFeatureRows,
	relatedReferences?: ServiceRelatedReference[],
): ServicePageContent {
	const service = services.find((entry) => entry.id === serviceId)!

	return {
		serviceId,
		title: service.labels[locale],
		slug: service.slugs[locale],
		hero,
		featureRows,
		relatedReferences,
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

		return buildPage(
			locale,
			catalogEntry.id,
			normalizeHero(result, locale, title),
			normalizeFeatureRows(result),
			normalizeRelatedReferences(result),
		)
	} catch {
		return buildPage(locale, catalogEntry.id, buildDefaultHero(locale, title))
	}
}
