
import { defineComponent } from "vue";
import { useNuxtApp } from "#app/nuxt";

const nuxtApp = () => import(('#app/entry')).then((m) => m.default).catch((err) => {});
const root = document.createElement('div');
root.style.display = 'none';
root.id = '__nuxt';
document.body.appendChild(root);

const app = nuxtApp()


app.then( async (m) => { 
   
    const vueApp = useNuxtApp().vueApp 
    console.log('vueApp ',vueApp.config.globalProperties)



})

defineComponent({
    setup() {
        return () => {
            const nuxtVueApp = useNuxtApp().vueApp
            console.log({nuxtVueApp})
            return nuxtVueApp
        }
    }
})

export default app;
