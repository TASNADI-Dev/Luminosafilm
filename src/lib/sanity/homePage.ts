// Fetches and normalizes localized home page content from Sanity.
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'
import {asset} from '../assets'
import type {Locale} from '../i18n'
import {urlFor} from './image'
import {HOME_PAGE_DOCUMENT_ID, HOME_PAGE_QUERY} from './queries'

const defaultHeroVideoUrl = asset('/home/Showreel.mp4')

export interface HeroSection {
  _type: 'heroSection'
  _key: string
  heading: string
  paragraph: string
  videoUrl: string
  buttonText: string
}

export interface LogoItem {
  _key: string
  alt?: string
  asset?: {
    _id: string
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
    }
  }
}

export interface LogosSection {
  _type: 'logosSection'
  _key: string
  logos: LogoItem[]
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

interface HomePageQueryResult {
  sections?: (HeroSection | LogosSection | WhyChooseUsQuerySection)[]
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

function isCompleteLogos(section: LogosSection | undefined): section is LogosSection {
  return Boolean(
    section?._type === 'logosSection' &&
      Array.isArray(section.logos) &&
      section.logos.length > 0 &&
      section.logos.every((logo) => logo.asset?.url),
  )
}

export async function getHomePageLogos(locale: Locale): Promise<LogosSection | null> {
  try {
    const result = await sanityClient.fetch<HomePageQueryResult | null>(HOME_PAGE_QUERY, {
      documentId: HOME_PAGE_DOCUMENT_ID,
      locale,
    })

    const logos = result?.sections?.find(
      (section): section is LogosSection => section._type === 'logosSection',
    )

    if (!isCompleteLogos(logos)) {
      return null
    }

    return logos
  } catch {
    return null
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
