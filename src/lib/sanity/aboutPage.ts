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
	width?: number
	height?: number
}

export interface ExperienceStat {
	value: string
	label: string
}

export interface Achievement {
	_key: string
	paragraph: string
	image?: AboutPageImage
}

export interface AboutPageContent {
	hero: AboutPageHero
	image?: AboutPageImage
	closingParagraph?: string
	experienceStats?: ExperienceStat[]
	achievements?: Achievement[]
}

interface AboutPageImageQuery {
	alt?: string
	hotspot?: unknown
	crop?: unknown
	asset?: {
		_id: string
		url: string
		metadata?: {
			dimensions?: {
				width?: number
				height?: number
			}
		}
	}
}

interface AchievementQuery {
	_key?: string
	paragraph?: string
	image?: AboutPageImageQuery
}

interface AboutPageQueryResult {
	heading?: string
	paragraph?: string
	closingParagraph?: string
	experienceStats?: Array<{
		value?: string
		label?: string
	}>
	achievements?: AchievementQuery[]
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

function imageBuilder(image: AboutPageImageQuery) {
	if (!image.asset?._id) {
		return undefined
	}

	return urlFor({
		asset: {_ref: image.asset._id},
		hotspot: image.hotspot,
		crop: image.crop,
	} as SanityImageSource)
}

function resolveImageUrl(image: AboutPageImageQuery): string | undefined {
	return imageBuilder(image)?.width(1440).height(810).fit('crop').auto('format').url()
}

const ACHIEVEMENT_IMAGE_WIDTH = 480

function normalizeAchievementImage(
	image: AboutPageImageQuery | undefined,
): AboutPageImage | undefined {
	if (!image) {
		return undefined
	}

	const url = imageBuilder(image)?.width(ACHIEVEMENT_IMAGE_WIDTH).fit('max').auto('format').url()
	if (!url) {
		return undefined
	}

	const dimensions = image.asset?.metadata?.dimensions
	const ratio =
		dimensions?.width && dimensions.height ? dimensions.height / dimensions.width : undefined

	return {
		url,
		alt: image.alt,
		width: ACHIEVEMENT_IMAGE_WIDTH,
		height: ratio ? Math.round(ACHIEVEMENT_IMAGE_WIDTH * ratio) : undefined,
	}
}

function normalizeExperienceStats(
	stats: AboutPageQueryResult['experienceStats'],
): ExperienceStat[] | undefined {
	if (!stats?.length) {
		return undefined
	}

	const items = stats.filter(
		(item): item is ExperienceStat =>
			Boolean(item?.value?.trim()) && Boolean(item?.label?.trim()),
	)

	return items.length > 0 ? items : undefined
}

function normalizeAchievements(items: AchievementQuery[] | undefined): Achievement[] | undefined {
	if (!items?.length) {
		return undefined
	}

	const achievements = items
		.map((item, index) => {
			if (!item.paragraph?.trim()) {
				return null
			}

			return {
				_key: item._key || `achievement-${index + 1}`,
				paragraph: item.paragraph,
				image: normalizeAchievementImage(item.image),
			}
		})
		.filter((item): item is Achievement => item !== null)

	return achievements.length > 0 ? achievements : undefined
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

		const experienceStats = normalizeExperienceStats(result?.experienceStats)
		const achievements = normalizeAchievements(result?.achievements)

		if (!result?.heading || !result.paragraph) {
			return {
				...fallback,
				image: normalizeImage(result?.image),
				closingParagraph: result?.closingParagraph,
				experienceStats,
				achievements,
			}
		}

		return {
			hero: {
				heading: result.heading,
				paragraph: result.paragraph,
			},
			image: normalizeImage(result.image),
			closingParagraph: result.closingParagraph,
			experienceStats,
			achievements,
		}
	} catch {
		return fallback
	}
}
