

const nuxtApp = () => import(('#app/entry')).then((m) => m.default).catch((err) => {});
const app = nuxtApp()

// app.then( async (m) => { 
//     console.log('  vueApp mounted: ',m)
// }).catch((err) => {  console.log('  vueApp error:',err)})

export default app;
