import {defineArrayMember} from 'sanity'
import {featureRowsSection} from './featureRowsSection'
import {heroSection} from './heroSection'
import {logosSection} from './logosSection'
import {serviceWhyChooseUsSection} from './serviceWhyChooseUsSection'
import {whyChooseUsSection} from './whyChooseUsSection'

export const homePageSectionTypes = [heroSection, logosSection, whyChooseUsSection]

export const homePageSections = homePageSectionTypes.map((section) =>
  defineArrayMember({type: section.name}),
)

export const servicePageSectionTypes = [featureRowsSection, serviceWhyChooseUsSection]
