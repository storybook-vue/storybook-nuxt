import {  defineNuxtPlugin, useNuxtApp } from "#app/nuxt"
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useState } from "#imports";
import { watchEffect } from "vue";


export default defineNuxtPlugin(async () => {
    await new Promise(resolve => setTimeout(resolve, 1))
    const nuxtApp = useNuxtApp();
    nuxtApp.hook('app:created', () => {

        console.log('storybook.client  app:created hook' , nuxtApp.vueApp )
        const ssrState = useState('__nuxt_storybook__')
         console.log('ssrState.value = ',ssrState.value)
    })
   // const { setup } = await import('@storybook/vue3');



    

   
    // watchEffect(() => {
    //     if (ssrState.value?.plugins)
    //         console.log('ssrState.value.plugins = ',ssrState.value.plugins)
    //   })
    // setup((app)=>{
    //     console.log('  setup app:',app)
    //     console.log('  setup context:')
    // } )

  })