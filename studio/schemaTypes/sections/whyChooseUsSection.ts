// Home page "why choose us" section: heading and numbered items (CTAs are code-owned).
import {defineArrayMember, defineField, defineType} from 'sanity'

export const whyChooseUsSection = defineType({
  name: 'whyChooseUsSection',
  title: 'Why Choose Us Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'whyChooseUsItem',
          fields: [
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
                  description: 'Brief description of the image for screen readers (localized).',
                }),
              ],
            }),
          ],
          preview: {
            select: {titleHu: 'title.hu', media: 'image'},
            prepare({titleHu, media}) {
              return {
                title: titleHu || 'Item',
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
        title: headingHu || 'Why Choose Us Section',
        subtitle: 'Why choose us',
      }
    },
  },
})
