import {homePage} from './homePage'
import {localizedString, localizedText} from './localized'
import {homePageSectionTypes} from './sections'

export const schemaTypes = [localizedString, localizedText, ...homePageSectionTypes, homePage]
