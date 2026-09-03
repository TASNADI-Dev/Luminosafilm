import {defineArrayMember} from 'sanity'
import {featureRowsSection} from './featureRowsSection'
import {heroSection} from './heroSection'
import {highlightedReferencesSection} from './highlightedReferencesSection'
import {logosSection} from './logosSection'
import {serviceRelatedReferencesSection} from './serviceRelatedReferencesSection'
import {serviceWhyChooseUsSection} from './serviceWhyChooseUsSection'
import {servicesOverviewSection} from './servicesOverviewSection'
import {whyChooseUsSection} from './whyChooseUsSection'

export const homePageSectionTypes = [
  heroSection,
  logosSection,
  servicesOverviewSection,
  whyChooseUsSection,
  highlightedReferencesSection,
]

export const homePageSections = homePageSectionTypes.map((section) =>
  defineArrayMember({type: section.name}),
)

export const servicePageSectionTypes = [
  featureRowsSection,
  serviceWhyChooseUsSection,
  serviceRelatedReferencesSection,
]
