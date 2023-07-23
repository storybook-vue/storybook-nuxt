let rootElement: HTMLElement | null = null;

function createNuxtRootAppContainer() {
  const root = document.createElement('div');
  root.style.display = 'none';
  root.id = '__nuxt';
  document.body.appendChild(root);
  return root;
}

export async function loadNuxtRootApp() {
  rootElement ??= createNuxtRootAppContainer();
  try {
    // const { appConfig } = await import('#build/dev');
    // console.log('loadNuxtRootApp appConfig', appConfig);
    const { default: entry } = await import('#app/entry');
    return entry();
  } catch (e) {
    console.log('loadNuxtRootApp e', e);
  }

  return undefined;
}
