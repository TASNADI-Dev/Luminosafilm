// Home page services overview: seven image/text blocks linking to service pages.
import {defineArrayMember, defineField, defineType} from 'sanity'

export const servicesOverviewSection = defineType({
  name: 'servicesOverviewSection',
  title: 'Services Overview Section',
  type: 'object',
  fields: [
    defineField({
      name: 'blocks',
      title: 'Blocks',
      description:
        'Exactly seven blocks — one per service. Odd/even layout (image side) is determined by order on the site.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicesOverviewBlock',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              description: 'Shared across languages. Set Hungarian and English alt text.',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'localizedString',
                  description: 'Brief description for screen readers (localized).',
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'paragraph',
              title: 'Paragraph',
              type: 'localizedText',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'service',
              title: 'Service page',
              description: 'The service page this block links to.',
              type: 'reference',
              to: [{type: 'servicePage'}],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              titleHu: 'heading.hu',
              media: 'image',
              serviceHeading: 'service.heading.hu',
            },
            prepare({titleHu, media, serviceHeading}) {
              return {
                title: titleHu || 'Block',
                subtitle: serviceHeading ? `→ ${serviceHeading}` : 'Service page',
                media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().length(7),
    }),
  ],
  preview: {
    select: {blocks: 'blocks'},
    prepare({blocks}) {
      const count = Array.isArray(blocks) ? blocks.length : 0
      return {
        title: 'Services Overview Section',
        subtitle: `${count} / 7 blocks`,
      }
    },
  },
})
