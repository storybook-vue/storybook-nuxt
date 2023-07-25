
const nuxtApp = () => import(('#app/entry')).then((m) => m.default).catch((err) => {});
const root = document.createElement('div');
root.style.display = 'none';
root.id = '__nuxt';
document.body.appendChild(root);

export default nuxtApp();
