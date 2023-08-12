import { NuxtPluginIndicator, createNuxtApp, defineNuxtPlugin, useNuxtApp } from "#app/nuxt"
// @ts-expect-error virtual file
import  plugins  from "#build/plugins"
import { App } from "vue";

const globalWindow = window as any;

export default defineNuxtPlugin({
    name: 'storybook-nuxt-plugin',
    enforce: 'pre', // or 'post'

    setup(nuxtApp) {
      console.log('[sb-nuxt][storybook-nuxt-plugin] setup() --------- ------------------')
      console.log(' nuxtApp   ',nuxtApp)
      if(nuxtApp.globalName !== 'nuxt')
      return
    
      const applyNuxtPlugins = async (vueApp: App,storyContext:any) => {
        console.log('\n\n[sb-nuxt][storybook-nuxt-plugin] applyNuxtPlugins() called:',vueApp)
        const nuxt = createNuxtApp({vueApp, globalName: storyContext.id})
        for (const plugin of plugins) {
          try{
            if(typeof plugin === 'function' && !plugin[NuxtPluginIndicator]){
              await vueApp.runWithContext(()  => plugin(nuxt))
              console.log(' plugin added :\n', plugin)  
            }
          }catch(e){
            console.log('error in plugin',e)
          }
        }
        return nuxt
      }
      
      globalWindow.STORYBOOK_VUE_GLOBAL_PLUGINS = []
      globalWindow.NUXT_APPLY_PLUGINS_FUNC = applyNuxtPlugins
      console.log('[sb-nuxt][storybook-nuxt-plugin]   ------- setup()-----end-----------------')
      
    },
  
    hooks: {
      'app:created'(nuxtApp)  {

        console.log('\n\n-----------------------------------------------------------------------')
        console.log('[sb-nuxt][storybook-nuxt-plugin] app:created() nuxtApp:',nuxtApp)

        console.log('[sb-nuxt][storybook-nuxt-plugin]  #app/plugins: ',plugins)
        
        // 
      }
    }
})

