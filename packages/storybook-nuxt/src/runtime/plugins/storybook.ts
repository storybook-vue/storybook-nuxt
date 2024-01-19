import { defineNuxtPlugin } from 'nuxt/app'
import { getContext } from 'unctx'

import logger from 'consola'

export default defineNuxtPlugin({
  name: 'storybook-nuxt-plugin',
  enforce: 'pre', // or 'post'

  setup(nuxtApp: any) {
    logger.log('🔌 🔌 🔌  [storybook-nuxt-plugin] setup ', { nuxtApp })
    const nuxtMainApp = getContext('nuxt-app')
    if (nuxtMainApp)
      logger.info('🔌  [storybook-nuxt-plugin] setup already done ', nuxtMainApp)
  },

  hooks: {
    'app:created': function () {
    },
  },
})
