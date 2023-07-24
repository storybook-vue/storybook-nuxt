export const nuxtApp = () => import('#app/entry').then((m) => m.default).catch((err) => {});

createRootElement();
nuxtApp();

function createRootElement() {
  const root = document.createElement('div');
  root.style.display = 'none';
  root.id = '__nuxt';
  document.body.appendChild(root);
  return root;
}
