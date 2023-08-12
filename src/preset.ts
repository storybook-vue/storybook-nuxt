/* eslint-disable import/no-unresolved */
import { join, resolve } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, searchForWorkspaceRoot, type UserConfig as ViteConfig } from 'vite';
import type { Nuxt } from '@nuxt/schema';


import { fileURLToPath } from 'node:url'

const packageDir = resolve(fileURLToPath(import.meta.url), '../..')
const distDir = resolve(fileURLToPath(import.meta.url), '..')
const runtimeDir = resolve(distDir, 'runtime')
const pluginsDir = resolve(runtimeDir, 'plugins')


import type { StorybookConfig } from './types';


async function configureNuxtVite(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt, addPlugin } = await import(require.resolve('@nuxt/kit'));
  const nuxt: Nuxt = await loadNuxt({
    rootDir: baseConfig.root,
    ready: false,
    dev: false,
  });

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder') {
    throw new Error(`Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`);
  }

  const collectedData = {
    viteConfig: {},
  };

  await nuxt.hook('modules:done', () => {
    // Add storybook plugin to nuxt
    //
    addPlugin({
      src: join(runtimeDir,'plugins/storybook'),
      mode: 'client',
    }); 

    nuxt.hook(
      'vite:extendConfig',
      (
        config: ViteConfig | PromiseLike<ViteConfig> | Record<string, any>,
        { isClient }: any
      ) => {
      
        if (isClient) {
          collectedData.viteConfig = mergeConfig(config, baseConfig);
        }
      }
    );
  });

  await nuxt.ready();
  
  try {
    await buildNuxt(nuxt);

    return {
      viteConfig: collectedData.viteConfig,
      nuxt,
    }
  }catch(e:any) {
    throw new Error(e);
  }
}
export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  return {
    ...config,
    builder:'@storybook/builder-vite',
    renderer: '@storybook/vue3',
  };
};
/**
 *
 * @param entry preview entries
 * @returns preview entries with nuxt runtime
 */
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, resolve(join(__dirname, "../preview"))];
};

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  options: any
) => {
  const  viteConfig = async (c: Record<string, any>, o: any) => {
    const { viteFinal } = await import( require.resolve(join("@storybook/vue3-vite", "preset")));
    return viteFinal(c, o);
  }
  const nuxtConfig = await configureNuxtVite(await viteConfig(config, options));
   
  const devtools = nuxtConfig.nuxt.options.runtimeConfig.public['devtools'] as Record<string, any> || {}
  const DEVTOOLS_UI_LOCAL_PORT = devtools.port?.toString()  ??   '12442'
  const DEVTOOLS_UI_ROUTE = '/__nuxt_devtools__/client'
  const mc = mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue','vue-demi'] } },
    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    optimizeDeps: { include: ['@storybook-vue/nuxt'] },
    server : { 
      cors : true ,
      proxy:{ [ DEVTOOLS_UI_ROUTE ] : { 
        target:`http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true, 
        secure: false,
        rewrite: (path: string) => path.replace(DEVTOOLS_UI_ROUTE, ''),
        ws:true 
      },
      
     },
     fs: { allow:[searchForWorkspaceRoot(process.cwd()),packageDir,runtimeDir,pluginsDir] }
    },
    preview: {
      headers: { "Access-Control-Allow-Origin": "*" , "Access-Control-Allow-Headers": "*"},
    },
    envPrefix: ['NUXT_'],
  });

  console.log('\n\n .... vite.server :',mc.server)

  return mc
};


