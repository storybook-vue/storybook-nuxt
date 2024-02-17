// import { useStorybook } from './runtime/composables/storybook'

import { applyPlugins, createNuxtApp } from 'nuxt/app'
import { nextTick } from 'vue'
import { getContext } from 'unctx'

// These files must be imported first as they have side effects:
// 1. (we set __webpack_public_path via this import, if using webpack builder)
import '#build/paths.mjs'

// 2. we set globalThis.$fetch via this import
import '#build/fetch.mjs'

// @ts-expect-error virtual file
import plugins from '#build/plugins'

import '#build/css'

const globalWindow = window as any

// entry()
const logger = console

async function applyNuxtPlugins(vueApp: any, storyContext: any) {
  const nuxt = createNuxtApp({ vueApp, globalName: `nuxt-${storyContext.id}` })
  getContext('nuxt-app').set(nuxt, true)
  logger.log('🔌 🔌 🔌  [storybook-nuxt-plugin] setup ', { nuxtApp: nuxt })
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
    // consola.error('Vue Error in plugins ', e)
  }

  return nuxt
}
globalWindow.PLUGINS_SETUP_FUNCTIONS ||= new Set()
globalWindow.PLUGINS_SETUP_FUNCTIONS.add(applyNuxtPlugins)

export default applyNuxtPlugins
