import {homePage} from './homePage'
import {localizedString, localizedText} from './localized'
import {servicePage} from './servicePage'
import {homePageSectionTypes} from './sections'

export const schemaTypes = [
  localizedString,
  localizedText,
  ...homePageSectionTypes,
  homePage,
  servicePage,
]
