import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'
import {homePageSections} from './sections/heroSection'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: homePageSections,
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {language: 'language'},
    prepare({language}) {
      return {
        title: 'Home Page',
        subtitle: language?.toUpperCase() || 'No language',
      }
    },
  },
})
