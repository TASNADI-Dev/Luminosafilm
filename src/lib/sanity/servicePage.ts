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

export interface ServiceFeatureRow {
	_key: string
	title: string
	body: string
	imageUrl?: string
	imageAlt?: string
}

export interface ServiceFeatureRows {
	heading: string
	rows: ServiceFeatureRow[]
}

export interface ServiceWhyChooseUsRow {
	_key: string
	title: string
	body: string
}

export interface ServiceWhyChooseUs {
	heading: string
	paragraph: string
	buttonText: string
	imageUrl?: string
	imageAlt?: string
	rows: ServiceWhyChooseUsRow[]
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
	whyChooseUs?: ServiceWhyChooseUs
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

interface ServiceFeatureRowQuery {
	_key?: string
	title?: string
	body?: string
	image?: ServiceHeroImageQuery
}

interface ServiceWhyChooseUsRowQuery {
	_key?: string
	title?: string
	body?: string
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
		rows?: ServiceFeatureRowQuery[]
	}
	whyChooseUs?: {
		heading?: string
		paragraph?: string
		buttonText?: string
		image?: ServiceHeroImageQuery
		rows?: ServiceWhyChooseUsRowQuery[]
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

function normalizeFeatureRows(
	result: ServicePageQueryResult | null,
): ServiceFeatureRows | undefined {
	const section = result?.featureRows
	if (!section?.heading || !section.rows?.length) {
		return undefined
	}

	const rows = section.rows
		.map((row, index) => {
			if (!row.title || !row.body) {
				return null
			}

			const imageUrl = row.image ? resolveImageUrl(row.image, 468, 342) : undefined

			return {
				_key: row._key || `row-${index + 1}`,
				title: row.title,
				body: row.body,
				imageUrl,
				imageAlt: row.image?.alt,
			}
		})
		.filter((row): row is ServiceFeatureRow => row !== null)

	if (rows.length === 0) {
		return undefined
	}

	return {
		heading: section.heading,
		rows,
	}
}

function normalizeWhyChooseUs(
	result: ServicePageQueryResult | null,
): ServiceWhyChooseUs | undefined {
	const section = result?.whyChooseUs
	if (
		!section?.heading ||
		!section.paragraph ||
		!section.buttonText ||
		!section.rows?.length
	) {
		return undefined
	}

	const rows = section.rows
		.map((row, index) => {
			if (!row.title || !row.body) {
				return null
			}

			return {
				_key: row._key || `row-${index + 1}`,
				title: row.title,
				body: row.body,
			}
		})
		.filter((row): row is ServiceWhyChooseUsRow => row !== null)

	if (rows.length === 0) {
		return undefined
	}

	const imageUrl = section.image ? resolveImageUrl(section.image, 960, 960) : undefined

	return {
		heading: section.heading,
		paragraph: section.paragraph,
		buttonText: section.buttonText,
		imageUrl,
		imageAlt: section.image?.alt,
		rows,
	}
}

/** Extracts a YouTube video ID from common watch, short, embed, and youtu.be URLs. */
function extractYoutubeId(url: string): string | undefined {
	try {
		const parsed = new URL(url)
		const host = parsed.hostname.replace(/^www\./, '')

		if (host === 'youtu.be') {
			const id = parsed.pathname.split('/').filter(Boolean)[0]
			return id || undefined
		}

		if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
			const watchId = parsed.searchParams.get('v')
			if (watchId) {
				return watchId
			}

			const parts = parsed.pathname.split('/').filter(Boolean)
			if (
				(parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') &&
				parts[1]
			) {
				return parts[1]
			}
		}
	} catch {
		return undefined
	}

	return undefined
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
	whyChooseUs?: ServiceWhyChooseUs,
	relatedReferences?: ServiceRelatedReference[],
): ServicePageContent {
	const service = services.find((entry) => entry.id === serviceId)!

	return {
		serviceId,
		title: service.labels[locale],
		slug: service.slugs[locale],
		hero,
		featureRows,
		whyChooseUs,
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
			normalizeWhyChooseUs(result),
			normalizeRelatedReferences(result),
		)
	} catch {
		return buildPage(locale, catalogEntry.id, buildDefaultHero(locale, title))
	}
}
