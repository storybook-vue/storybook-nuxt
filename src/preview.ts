
const nuxtApp = () => import(('#app/entry')).then((m) => m.default).catch((err) => {});
const root = document.createElement('div');
root.style.display = 'none';
root.id = '__nuxt';
document.body.appendChild(root);

const app = nuxtApp()


app.then( async (m) => { 
    const { useNuxtApp } = await import( "#app");
    const vueApp = useNuxtApp().vueApp 
    console.log('  vueApp mounted:',vueApp)
}).catch((err) => {  console.log('  vueApp error:',err)})


export default app;
