// About page singleton: localized hero copy + shared hero image.
import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
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
      name: 'image',
      title: 'Hero image',
      description: 'Shared across languages. Upload once; set Hungarian and English alt text.',
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
      name: 'closingParagraph',
      title: 'Closing paragraph',
      type: 'localizedText',
      description: 'Centered paragraph shown below the hero image.',
    }),
    defineField({
      name: 'experienceStats',
      title: 'Experience stats',
      description:
        'Three statistics showcasing company experience (e.g. years of experience, projects completed).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'experienceStat',
          fields: [
            defineField({
              name: 'value',
              title: 'Number',
              type: 'string',
              description: 'Large stat value (e.g. "10", "500+").',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localizedString',
              description: 'Short description shown below the number.',
            }),
          ],
          preview: {
            select: {value: 'value', labelHu: 'label.hu'},
            prepare({value, labelHu}) {
              return {
                title: value || 'Stat',
                subtitle: labelHu,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.length(3),
    }),
    defineField({
      name: 'achievements',
      title: 'Recognitions',
      description:
        'Awards and recognitions listed under the "Eredményeink" / "Our recognitions" heading. Newest first.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'achievement',
          fields: [
            defineField({
              name: 'paragraph',
              title: 'Paragraph',
              type: 'localizedText',
              description: 'Full award description for each language.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Laurel / award image',
              description: 'Optional. Shared across languages; set Hungarian and English alt text.',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'localizedString',
                  description: 'Brief description for screen readers (localized).',
                }),
              ],
            }),
          ],
          preview: {
            select: {paragraphHu: 'paragraph.hu', media: 'image'},
            prepare({paragraphHu, media}) {
              return {
                title: paragraphHu || 'Recognition',
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
      }
    },
  },
})
