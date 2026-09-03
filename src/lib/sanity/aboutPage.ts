// Fetches the about page singleton content from Sanity.
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'
import type {Locale} from '../i18n'
import {urlFor} from './image'
import {ABOUT_PAGE_DOCUMENT_ID, ABOUT_PAGE_QUERY} from './queries'

export interface AboutPageHero {
	heading: string
	paragraph: string
}

export interface AboutPageImage {
	url: string
	alt?: string
}

export interface AboutPageContent {
	hero: AboutPageHero
	image?: AboutPageImage
	closingParagraph?: string
}

interface AboutPageImageQuery {
	alt?: string
	hotspot?: unknown
	crop?: unknown
	asset?: {
		_id: string
		url: string
	}
}

interface AboutPageQueryResult {
	heading?: string
	paragraph?: string
	closingParagraph?: string
	image?: AboutPageImageQuery
}

const defaultHeroByLocale: Record<Locale, AboutPageHero> = {
	hu: {
		heading: 'Rólunk',
		paragraph:
			'Ismerje meg a Luminosa Film csapatát és a történetünket a dokumentumfilmek és videóprojektek világában.',
	},
	en: {
		heading: 'About',
		paragraph:
			'Meet the Luminosa Film team and our story in the world of documentaries and video projects.',
	},
}

function resolveImageUrl(image: AboutPageImageQuery): string | undefined {
	if (!image.asset?._id) {
		return undefined
	}

	return urlFor({
		asset: {_ref: image.asset._id},
		hotspot: image.hotspot,
		crop: image.crop,
	} as SanityImageSource)
		.width(1440)
		.height(810)
		.fit('crop')
		.auto('format')
		.url()
}

function normalizeImage(image: AboutPageImageQuery | undefined): AboutPageImage | undefined {
	if (!image) {
		return undefined
	}

	const url = resolveImageUrl(image)
	if (!url) {
		return undefined
	}

	return {
		url,
		alt: image.alt,
	}
}

export async function getAboutPage(locale: Locale): Promise<AboutPageContent> {
	const fallback: AboutPageContent = {
		hero: defaultHeroByLocale[locale],
	}

	try {
		const result = await sanityClient.fetch<AboutPageQueryResult | null>(ABOUT_PAGE_QUERY, {
			documentId: ABOUT_PAGE_DOCUMENT_ID,
			locale,
		})

		if (!result?.heading || !result.paragraph) {
			return {
				...fallback,
				image: normalizeImage(result?.image),
				closingParagraph: result?.closingParagraph,
			}
		}

		return {
			hero: {
				heading: result.heading,
				paragraph: result.paragraph,
			},
			image: normalizeImage(result.image),
			closingParagraph: result.closingParagraph,
		}
	} catch {
		return fallback
	}
}
