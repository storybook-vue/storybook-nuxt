// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { defineNuxtPlugin } from '#app'
import {  useNuxt } from '@nuxt/kit'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useState } from '#imports'

export default defineNuxtPlugin(() => {
    const nuxt = useNuxt()
    nuxt.hook('app:resolve', () => {
        console.log('\n storybook.server  app:resolve hook' , nuxt.options.plugins)
         const state = useState('__nuxt_storybook__', () => ({
            plugins: nuxt.options.plugins,
            modules: nuxt.options.modules,
            started:false

         }))

         state.value.started = true

    })

  // record ssr start time
 
  
})
