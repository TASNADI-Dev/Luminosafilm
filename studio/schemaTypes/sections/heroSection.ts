import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
      initialValue: 'https://lorem.video/1280x720',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {headingHu: 'heading.hu'},
    prepare({headingHu}) {
      return {
        title: headingHu || 'Hero Section',
        subtitle: 'Hero',
      }
    },
  },
})

export const homePageSections = [defineArrayMember({type: 'heroSection'})]
