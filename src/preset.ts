/* eslint-disable import/no-unresolved */
import { join } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, type UserConfig as ViteConfig } from 'vite';
import type { Nuxt } from '@nuxt/schema';
import { startSubprocess } from '@nuxt/devtools-kit';

import type { StorybookConfig } from './types';

async function configureNuxtVite(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt } = await import(require.resolve('@nuxt/kit'));
  const nuxt: Nuxt = await loadNuxt({
    rootDir: baseConfig.root,
    ready: false,
    dev: true,
  });

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder') {
    throw new Error(`Storybook-Nuxt does not support '${nuxt.options.builder}' for now.`);
  }

  return {
    viteConfig: await new Promise<ViteConfig>((resolve, reject) => {
      nuxt.hook('modules:done', () => {
        nuxt.hook(
          'vite:extendConfig',
          (
            config: ViteConfig | PromiseLike<ViteConfig> | Record<string, any>,
            { isClient }: any
          ) => {
            if (isClient) {
              resolve(mergeConfig(config, baseConfig));
            }
          }
        );
      });
      nuxt
        .ready()
        .then(() => {
          buildNuxt(nuxt).catch(reject);
          startNuxtDevServer(nuxt).catch(reject)
        })
        .catch((err: { toString: () => string | string[] }) => {
          if (!err.toString().includes('_stop_')) {
            reject(err);
          }
        });
    }),
    nuxt,
  };
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
  return [...entry, require.resolve("@storybook-vue/nuxt/preview.js")];
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

  const DEVTOOLS_UI_LOCAL_PORT =  nuxtConfig.nuxt.options.devServer.port ??  '3000'
  const DEVTOOLS_UI_ROUTE = '/__nuxt_devtools__/client'
  return mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue'] } },
    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    server : { 
      cors : true ,
      proxy:{ [ DEVTOOLS_UI_ROUTE ] : { 
        target:`http://localhost:${DEVTOOLS_UI_LOCAL_PORT}`,
        changeOrigin: true, 
        secure: false,
        ws:true 
      } 
     }
    },
    preview: {
      headers: { "Access-Control-Allow-Origin": "*" , "Access-Control-Allow-Headers": "*"},
    },
    envPrefix: ['NUXT_'],
  });
};

const startNuxtDevServer = async (nuxt: Nuxt) => {

  const _process = startSubprocess(
    {
      command: 'npx',
      args: ['nuxi', 'dev', '--port', '3300'],
      cwd: nuxt.options.rootDir,
    },
    {
      id: 'nuxt:dev',
      name: ' run Nuxt dev server',
    },
    nuxt,
  )
  _process.getProcess().stderr?.pipe(process.stderr)
  _process.getProcess().stdout?.pipe(process.stdout)
  return _process
}


