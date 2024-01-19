import { createNuxtApp, defineNuxtPlugin, useRouter } from 'nuxt/app'
import { getContext } from 'unctx'
import { nextTick } from 'vue'
import logger from 'consola'

// @ts-expect-error virtual file
import plugins from '#build/plugins'

import '#build/css'

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
      // getContext('nuxt-app').set(nuxt, true)

      const router = nuxtApp.$router ?? useRouter()
      nuxt.$router = router

      for (const plugin of plugins) {
        try {
          if (typeof plugin === 'function' && !plugin.toString().includes('definePayloadReviver'))
            await vueApp.runWithContext(() => plugin(nuxt))
        }
        catch (e) {
          logger.error('Error in plugin ', plugin)
        }
      }
      try {
        await nuxt.hooks.callHook('app:created', vueApp)
        await nuxt.hooks.callHook('app:beforeMount', vueApp)
        setTimeout(async () => {
          await nuxt.hooks.callHook('app:mounted', vueApp)
          await nextTick()
        }, 10)
        getContext(nuxt.globalName).set(nuxt, true)
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
