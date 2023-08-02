/* eslint-disable import/no-unresolved */
import { join } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, type UserConfig as ViteConfig } from 'vite';
import type { Nuxt } from '@nuxt/schema';

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

  const { host = 'localhost' , port = 3000 } = nuxtConfig.nuxt.options.runtimeConfig.app 
  const target = `//${host}:${port}`

  return mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue'] } },
    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    server : { 
      cors : true ,
      proxy:{ '/__nuxt_devtools__/client/': { target , changeOrigin: true, pathRewrite: { '^/api': '' } } }
    },
    preview: {
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    envPrefix: ['NUXT_'],
  });
};


