import {defineArrayMember} from 'sanity'
import {heroSection} from './heroSection'
import {logosSection} from './logosSection'

export const homePageSectionTypes = [heroSection, logosSection]

export const homePageSections = homePageSectionTypes.map((section) =>
  defineArrayMember({type: section.name}),
)
