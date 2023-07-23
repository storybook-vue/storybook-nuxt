/* eslint-disable import/no-unresolved */

// https://storybook.js.org/docs/react/addons/writing-presets
import {  join } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, type UserConfig as ViteConfig } from 'vite';
import { viteFinal as vue3ViteFinal } from '@storybook/vue3-vite/preset';
import type { Nuxt } from '@nuxt/schema';

import type { StorybookConfig } from './types';

async function configureNuxtVite(baseConfig: Record<string, any>) {
  const { loadNuxt, buildNuxt, createResolver } = await import('@nuxt/kit');
  const nuxt: Nuxt = await loadNuxt({
    rootDir: baseConfig.root,
    ready: false,
    dev: true,
  });

  if ((nuxt.options.builder as string) !== '@nuxt/vite-builder') {
    throw new Error(`Storybook-Nuxt does not support '${nuxt.options.builder}'.`);
  }

  const resolver = createResolver( __dirname);
  const runtimeDir = resolver.resolve('../runtime');
  nuxt.options.build.transpile.push(runtimeDir);
  nuxt.options.alias['~storybook'] = runtimeDir;

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
export const core: PresetProperty<any> = {
  builder: "@storybook/builder-vite",
  renderer: "@storybook/vue3",
}
/**
 *
 * @param entry preview entries
 * @returns preview entries with nuxt runtime
 */
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, require.resolve(join(__dirname, 'preview.js'))];
};

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  options: any
) => {
  const nuxtConfig = await configureNuxtVite(await vue3ViteFinal(config, options));
  return mergeConfig(nuxtConfig.viteConfig, {
    build: { rollupOptions: { external: ['vue'] } },

    define: {
      __NUXT__: JSON.stringify({ config: nuxtConfig.nuxt.options.runtimeConfig }),
    },
    envPrefix: ['NUXT_'],
  });
};
