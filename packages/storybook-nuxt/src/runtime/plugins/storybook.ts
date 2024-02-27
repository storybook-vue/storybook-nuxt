import { applyPlugins, createNuxtApp, defineNuxtPlugin } from 'nuxt/app'
import { getContext } from 'unctx'

// These files must be imported first as they have side effects:
// 1. (we set __webpack_public_path via this import, if using webpack builder)
import '#build/paths.mjs'

// 2. we set globalThis.$fetch via this import
import '#build/fetch.mjs'

import logger from 'consola'
import { nextTick } from 'vue'

// @ts-expect-error virtual file
import plugins from '#build/plugins'

const globalWindow = window as any

export default defineNuxtPlugin({
  name: 'storybook-nuxt-plugin',
  enforce: 'pre', // or 'post'

  setup(nuxtApp: any) {
    logger.log('🔌 🔌 🔌  [storybook-nuxt-plugin] setup ', { nuxtApp })
    const nuxtMainApp = getContext('nuxt-app')
    if (nuxtMainApp)
      logger.info('🔌  [storybook-nuxt-plugin] setup already done ', nuxtMainApp)
    if (nuxtApp.globalName !== 'nuxt')
      return
    const applyNuxtPlugins = async (vueApp: any, storyContext: any) => {
      const nuxt = createNuxtApp({ vueApp, globalName: `nuxt-${storyContext.id}` })
      getContext('nuxt-app').set(nuxt, true)
      async function handleVueError(err: any) {
        await nuxt.callHook('app:error', err)
        nuxt.payload.error = (nuxt.payload.error || err) as any
      }

      vueApp.config.errorHandler = handleVueError

      try {
        await applyPlugins(nuxt, plugins)
      }
      catch (err) {
        handleVueError(err)
      }
      try {
        await nuxt.hooks.callHook('app:created', vueApp)
        await nuxt.hooks.callHook('app:beforeMount', vueApp)
        setTimeout(async () => {
          await nuxt.hooks.callHook('app:mounted', vueApp)
          await nextTick()
        }, 10)
      }
      catch (e) {
        logger.error('Vue Error in plugins ', e)
      }

      return nuxt
    }

    globalWindow.PLUGINS_SETUP_FUNCTIONS ||= new Set()
    globalWindow.PLUGINS_SETUP_FUNCTIONS.add(applyNuxtPlugins)
  },

  hooks: {
    'app:created': function () {
    },
  },
})
