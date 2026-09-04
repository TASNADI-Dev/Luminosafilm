// Fetches and normalizes localized home page content from Sanity.
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'
import {asset} from '../assets'
import {type Locale, type ServiceId, isServiceId, services, servicePath} from '../i18n'
import {urlFor} from './image'
import {HOME_PAGE_DOCUMENT_ID, HOME_PAGE_QUERY} from './queries'
import {extractYoutubeId} from './youtube'

const defaultHeroVideoUrl = asset('/home/Showreel.mp4')

export interface HeroSection {
  _type: 'heroSection'
  _key: string
  heading: string
  paragraph: string
  videoUrl: string
  buttonText: string
}

export interface WhyChooseUsItem {
  _key: string
  title: string
  body: string
  imageUrl?: string
  imageAlt?: string
}

export interface WhyChooseUsSection {
  _type: 'whyChooseUsSection'
  _key: string
  heading: string
  items: WhyChooseUsItem[]
}

export interface ServicesOverviewBlock {
  _key: string
  heading: string
  paragraph: string
  href: string
  imageUrl?: string
  imageAlt?: string
}

export interface ServicesOverviewSection {
  _type: 'servicesOverviewSection'
  _key: string
  blocks: ServicesOverviewBlock[]
}

export interface HomeHighlightedReference {
  _key: string
  title: string
  videoUrl: string
  youtubeId: string
}

export interface HomeHighlightedReferencesSection {
  _type: 'highlightedReferencesSection'
  _key: string
  items: HomeHighlightedReference[]
}

interface WhyChooseUsQueryItem {
  _key: string
  title?: string
  body?: string
  image?: {
    alt?: string
    hotspot?: unknown
    crop?: unknown
    asset?: {
      _id: string
      url: string
    }
  }
}

interface WhyChooseUsQuerySection {
  _type: 'whyChooseUsSection'
  _key: string
  heading?: string
  items?: WhyChooseUsQueryItem[]
}

interface ServicesOverviewQueryBlock {
  _key: string
  heading?: string
  paragraph?: string
  serviceDocumentId?: string
  image?: {
    alt?: string
    hotspot?: unknown
    crop?: unknown
    asset?: {
      _id: string
      url: string
    }
  }
}

interface ServicesOverviewQuerySection {
  _type: 'servicesOverviewSection'
  _key: string
  blocks?: ServicesOverviewQueryBlock[]
}

interface HomeHighlightedReferenceQueryItem {
  _key?: string
  title?: string
  videoUrl?: string
}

interface HomeHighlightedReferencesQuerySection {
  _type: 'highlightedReferencesSection'
  _key: string
  items?: HomeHighlightedReferenceQueryItem[]
}

interface HomePageQueryResult {
  sections?: (
    | HeroSection
    | WhyChooseUsQuerySection
    | ServicesOverviewQuerySection
    | HomeHighlightedReferencesQuerySection
  )[]
}

const defaultHeroByLocale: Record<Locale, Omit<HeroSection, '_type' | '_key'>> = {
  hu: {
    heading: 'Professzionális filmkészítés',
    paragraph:
      'Egyedi vizuális történeteket alkotunk, amelyek emlékezetes élményt nyújtanak a közönségnek.',
    videoUrl: defaultHeroVideoUrl,
    buttonText: 'Kapcsolatfelvétel',
  },
  en: {
    heading: 'Professional filmmaking',
    paragraph:
      'We craft distinctive visual stories that create memorable experiences for your audience.',
    videoUrl: defaultHeroVideoUrl,
    buttonText: 'Get in touch',
  },
}

function buildDefaultHero(locale: Locale): HeroSection {
  return {
    _type: 'heroSection',
    _key: 'hero',
    ...defaultHeroByLocale[locale],
  }
}

function isCompleteHero(section: HeroSection | undefined): section is HeroSection {
  return Boolean(
    section?._type === 'heroSection' &&
      section.heading &&
      section.paragraph &&
      section.videoUrl &&
      section.buttonText,
  )
}

export async function getHomePageHero(locale: Locale): Promise<HeroSection> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const hero = result?.sections?.find(
      (section): section is HeroSection => section._type === 'heroSection',
    )

    if (!isCompleteHero(hero)) {
      return buildDefaultHero(locale)
    }

    return hero
  } catch {
    return buildDefaultHero(locale)
  }
}

const loremItemTitle = 'Lorem ipsum'
const loremItemBody =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'

const defaultWhyChooseUsByLocale: Record<
  Locale,
  Omit<WhyChooseUsSection, '_type' | '_key' | 'items'>
> = {
  hu: {
    heading: 'Miért minket válassz',
  },
  en: {
    heading: 'Why choose us',
  },
}

function buildDefaultWhyChooseUsItems(): WhyChooseUsItem[] {
  return [1, 2, 3, 4].map((n) => ({
    _key: `item-${n}`,
    title: loremItemTitle,
    body: loremItemBody,
  }))
}

function buildDefaultWhyChooseUs(locale: Locale): WhyChooseUsSection {
  return {
    _type: 'whyChooseUsSection',
    _key: 'why-choose-us',
    ...defaultWhyChooseUsByLocale[locale],
    items: buildDefaultWhyChooseUsItems(),
  }
}

function resolveWhyChooseUsItemImage(item: WhyChooseUsQueryItem): string | undefined {
  if (!item.image?.asset?._id) {
    return undefined
  }

  return urlFor({
    asset: {_ref: item.image.asset._id},
    hotspot: item.image.hotspot,
    crop: item.image.crop,
  } as SanityImageSource)
    .width(192)
    .height(192)
    .fit('crop')
    .auto('format')
    .url()
}

function isCompleteWhyChooseUs(
  section: WhyChooseUsQuerySection | undefined,
): section is WhyChooseUsQuerySection & {
  heading: string
  items: WhyChooseUsQueryItem[]
} {
  return Boolean(
    section?._type === 'whyChooseUsSection' &&
      section.heading &&
      Array.isArray(section.items) &&
      section.items.length > 0 &&
      section.items.every((item) => item.title && item.body),
  )
}

export async function getHomePageWhyChooseUs(locale: Locale): Promise<WhyChooseUsSection> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const section = result?.sections?.find(
      (entry): entry is WhyChooseUsQuerySection => entry._type === 'whyChooseUsSection',
    )

    if (!isCompleteWhyChooseUs(section)) {
      return buildDefaultWhyChooseUs(locale)
    }

    return {
      _type: 'whyChooseUsSection',
      _key: section._key,
      heading: section.heading,
      items: section.items.map((item) => ({
        _key: item._key,
        title: item.title!,
        body: item.body!,
        imageUrl: resolveWhyChooseUsItemImage(item),
        imageAlt: item.image?.alt,
      })),
    }
  } catch {
    return buildDefaultWhyChooseUs(locale)
  }
}

const loremServicesOverviewParagraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

function serviceIdFromDocumentId(documentId: string | undefined): ServiceId | undefined {
  if (!documentId) {
    return undefined
  }

  const normalized = documentId.replace(/^drafts\./, '')
  const prefix = 'servicePage-'
  if (!normalized.startsWith(prefix)) {
    return undefined
  }

  const id = normalized.slice(prefix.length)
  return isServiceId(id) ? id : undefined
}

function resolveServicesOverviewBlockImage(block: ServicesOverviewQueryBlock): string | undefined {
  if (!block.image?.asset?._id) {
    return undefined
  }

  return urlFor({
    asset: {_ref: block.image.asset._id},
    hotspot: block.image.hotspot,
    crop: block.image.crop,
  } as SanityImageSource)
    .width(960)
    .height(720)
    .fit('crop')
    .auto('format')
    .url()
}

function buildDefaultServicesOverview(locale: Locale): ServicesOverviewSection {
  return {
    _type: 'servicesOverviewSection',
    _key: 'services-overview',
    blocks: services.map((service) => ({
      _key: service.id,
      heading: service.labels[locale],
      paragraph: loremServicesOverviewParagraph,
      href: servicePath(locale, service.id),
    })),
  }
}

function isCompleteServicesOverview(
  section: ServicesOverviewQuerySection | undefined,
): section is ServicesOverviewQuerySection & {
  blocks: ServicesOverviewQueryBlock[]
} {
  return Boolean(
    section?._type === 'servicesOverviewSection' &&
      Array.isArray(section.blocks) &&
      section.blocks.length === 7 &&
      section.blocks.every(
        (block) =>
          block.heading &&
          block.paragraph &&
          serviceIdFromDocumentId(block.serviceDocumentId),
      ),
  )
}

export async function getHomePageServicesOverview(
  locale: Locale,
): Promise<ServicesOverviewSection> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const section = result?.sections?.find(
      (entry): entry is ServicesOverviewQuerySection =>
        entry._type === 'servicesOverviewSection',
    )

    if (!isCompleteServicesOverview(section)) {
      return buildDefaultServicesOverview(locale)
    }

    return {
      _type: 'servicesOverviewSection',
      _key: section._key,
      blocks: section.blocks.map((block) => {
        const serviceId = serviceIdFromDocumentId(block.serviceDocumentId)!
        return {
          _key: block._key,
          heading: block.heading!,
          paragraph: block.paragraph!,
          href: servicePath(locale, serviceId),
          imageUrl: resolveServicesOverviewBlockImage(block),
          imageAlt: block.image?.alt,
        }
      }),
    }
  } catch {
    return buildDefaultServicesOverview(locale)
  }
}

function normalizeHomeHighlightedReferences(
  section: HomeHighlightedReferencesQuerySection | undefined,
): HomeHighlightedReferencesSection | null {
  if (section?._type !== 'highlightedReferencesSection' || !section.items?.length) {
    return null
  }

  const items = section.items
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
    .filter((item): item is HomeHighlightedReference => item !== null)

  if (!items.length) {
    return null
  }

  return {
    _type: 'highlightedReferencesSection',
    _key: section._key,
    items,
  }
}

export async function getHomePageHighlightedReferences(
  locale: Locale,
): Promise<HomeHighlightedReferencesSection | null> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const section = result?.sections?.find(
      (entry): entry is HomeHighlightedReferencesQuerySection =>
        entry._type === 'highlightedReferencesSection',
    )

    return normalizeHomeHighlightedReferences(section)
  } catch {
    return null
  }
}
