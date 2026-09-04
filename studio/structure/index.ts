import {HomeIcon} from '@sanity/icons/Home'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {DocumentIcon} from '@sanity/icons/Document'
import {ImagesIcon} from '@sanity/icons/Images'
import {UsersIcon} from '@sanity/icons/Users'
import {SparklesIcon} from '@sanity/icons/Sparkles'
import type {StructureResolver} from 'sanity/structure'

/** Fixed service page documents — IDs must match `servicePageDocumentId()` in the site catalog. */
const servicePages = [
  {documentId: 'servicePage-documentaries', title: 'Dokumentumfilmek'},
  {documentId: 'servicePage-oral-history', title: 'Oral history'},
  {documentId: 'servicePage-promotional-films', title: 'Promóciós filmek'},
  {documentId: 'servicePage-ngo-presentations', title: 'Civil szervezetek bemutatása'},
  {documentId: 'servicePage-education', title: 'Oktatás'},
  {documentId: 'servicePage-grant-writing', title: 'Pályázatírás és megvalósítás'},
  {documentId: 'servicePage-equipment-rental', title: 'Eszközbérlés'},
] as const

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
          S.list()
            .title('Service Pages')
            .items(
              servicePages.map((page) =>
                S.listItem()
                  .title(page.title)
                  .icon(DocumentIcon)
                  .id(page.documentId)
                  .child(
                    S.document()
                      .schemaType('servicePage')
                      .documentId(page.documentId)
                      .title(page.title),
                  ),
              ),
            ),
        ),
      S.listItem()
        .title('References Page')
        .icon(ImagesIcon)
        .child(
          S.document()
            .schemaType('referencesPage')
            .documentId('referencesPage')
            .title('References Page'),
        ),
      S.listItem()
        .title('About Page')
        .icon(UsersIcon)
        .child(
          S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page'),
        ),
      S.listItem()
        .title('Global CTA Section')
        .icon(SparklesIcon)
        .child(
          S.document()
            .schemaType('globalCtaSection')
            .documentId('globalCtaSection')
            .title('Global CTA Section'),
        ),
      S.listItem()
        .title('Client Logos')
        .icon(ImagesIcon)
        .child(
          S.document().schemaType('clientLogos').documentId('clientLogos').title('Client Logos'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== 'homePage' &&
          item.getId() !== 'servicePage' &&
          item.getId() !== 'referencesPage' &&
          item.getId() !== 'aboutPage' &&
          item.getId() !== 'globalCtaSection' &&
          item.getId() !== 'clientLogos',
      ),
    ])
