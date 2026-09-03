import {HomeIcon} from '@sanity/icons/Home'
import {DocumentsIcon} from '@sanity/icons/Documents'
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
      S.listItem()
        .title('Service Pages')
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList('servicePage').title('Service Pages').defaultOrdering([
            {field: 'title.hu', direction: 'asc'},
          ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'homePage' && item.getId() !== 'servicePage',
      ),
    ])
