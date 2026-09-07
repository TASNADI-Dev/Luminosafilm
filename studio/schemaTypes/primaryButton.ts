// Site-wide primary button label singleton. The href stays code-owned.
import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const primaryButton = defineType({
  name: 'primaryButton',
  title: 'Primary Button',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button text',
      description: 'Shared label for every primary CTA. The link target is defined in code.',
      type: 'localizedString',
      initialValue: {
        hu: 'Kapcsolatfelvétel',
        en: 'Get in touch',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Primary Button',
      }
    },
  },
})
