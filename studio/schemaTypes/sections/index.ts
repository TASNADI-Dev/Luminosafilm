import {defineArrayMember} from 'sanity'
import {heroSection} from './heroSection'
import {logosSection} from './logosSection'
import {whyChooseUsSection} from './whyChooseUsSection'

export const homePageSectionTypes = [heroSection, logosSection, whyChooseUsSection]

export const homePageSections = homePageSectionTypes.map((section) =>
  defineArrayMember({type: section.name}),
)
