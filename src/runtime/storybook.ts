import {  defineNuxtPlugin, useNuxtApp } from "#app/nuxt"
import { setup } from "@storybook/vue3";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useState } from "#imports";
import { App } from "vue";

export default defineNuxtPlugin(async () => {
    // await new Promise(resolve => setTimeout(resolve, 1))
    const nuxtApp = useNuxtApp();
    nuxtApp.hook('app:created',async () => {
        console.log('\n\n-------------------------------------------------------')  
        console.log('---> storybook.client  app:created hook, $nuxt ' , nuxtApp.vueApp  )
        console.log('-------------------------------------------------------\n\n')
        // const { setup } = await import('@storybook/vue3');
        setup((app:App)=>{
          console.log(' --- setup app:',app)
          console.log('  --setup context:')
          app.config.globalProperties = nuxtApp.vueApp.config.globalProperties
          app.config = nuxtApp.vueApp.config
          // return () => h(app)
        } )
        
    })
    

  
  })