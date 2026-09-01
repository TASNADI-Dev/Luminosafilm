import {HomeIcon} from '@sanity/icons/Home'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.document().schemaType('homePage').documentId('homePage').title('Home Page'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'homePage'),
    ])
