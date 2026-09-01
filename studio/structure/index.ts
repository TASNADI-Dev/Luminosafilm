import {HomeIcon} from '@sanity/icons/Home'
import type {StructureResolver} from 'sanity/structure'

const LOCALES = ['hu', 'en'] as const

function createLocalizedSingleton(
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  icon: typeof HomeIcon,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items(
          LOCALES.map((locale) =>
            S.listItem()
              .title(`${title} (${locale.toUpperCase()})`)
              .icon(icon)
              .child(
                S.document()
                  .schemaType(typeName)
                  .documentId(`${typeName}-${locale}`)
                  .title(`${title} (${locale.toUpperCase()})`)
                  .initialValueTemplate(`${typeName}-${locale}`),
              ),
          ),
        ),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      createLocalizedSingleton(S, 'homePage', 'Home Page', HomeIcon),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'homePage'),
    ])
