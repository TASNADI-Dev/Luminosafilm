import {defineArrayMember} from 'sanity'
import {featureRowsSection} from './featureRowsSection'
import {heroSection} from './heroSection'
import {highlightedReferencesSection} from './highlightedReferencesSection'
import {serviceRelatedReferencesSection} from './serviceRelatedReferencesSection'
import {servicesOverviewSection} from './servicesOverviewSection'

export const homePageSectionTypes = [
  heroSection,
  servicesOverviewSection,
  highlightedReferencesSection,
]

export const homePageSections = homePageSectionTypes.map((section) =>
  defineArrayMember({type: section.name}),
)

export const servicePageSectionTypes = [
  featureRowsSection,
  serviceRelatedReferencesSection,
]
