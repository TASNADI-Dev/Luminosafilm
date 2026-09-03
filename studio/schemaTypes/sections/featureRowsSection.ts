// Service page section: heading plus image / title / body rows.
import {defineArrayMember, defineField, defineType} from 'sanity'

export const featureRowsSection = defineType({
  name: 'featureRowsSection',
  title: 'Feature Rows Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureRow',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
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
              name: 'title',
              title: 'Title',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'localizedText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {titleHu: 'title.hu', media: 'image'},
            prepare({titleHu, media}) {
              return {
                title: titleHu || 'Row',
                media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
  ],
  preview: {
    select: {headingHu: 'heading.hu'},
    prepare({headingHu}) {
      return {
        title: headingHu || 'Feature Rows Section',
        subtitle: 'Feature rows',
      }
    },
  },
})
