// Service page "why choose us" section: image, heading, intro, boxed rows, button text (link is code-owned).
import {defineArrayMember, defineField, defineType} from 'sanity'

export const serviceWhyChooseUsSection = defineType({
  name: 'serviceWhyChooseUsSection',
  title: 'Why Choose Us Section',
  type: 'object',
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
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceWhyChooseUsRow',
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
          ],
          preview: {
            select: {titleHu: 'title.hu'},
            prepare({titleHu}) {
              return {
                title: titleHu || 'Row',
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      description: 'Button label only. The link target is defined in code.',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {headingHu: 'heading.hu', media: 'image'},
    prepare({headingHu, media}) {
      return {
        title: headingHu || 'Why Choose Us Section',
        subtitle: 'Why choose us',
        media,
      }
    },
  },
})
