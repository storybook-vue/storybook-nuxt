
import type { BuilderOptions, StorybookConfig as StorybookConfigBase } from '@storybook/types';

type FrameworkName = '@storybook-vue/nuxt';
type BuilderName = '@storybook/builder-vite';

export type FrameworkOptions = NuxtOptions & {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework: FrameworkName | { name: FrameworkName; options: FrameworkOptions}
  core?: StorybookConfigBase['core'] & { builder?: BuilderName  }  
  typescript?: StorybookConfigBase['typescript'];
  previewAnnotations?: StorybookConfigBase['previewAnnotations'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = { viteFinal:Record<string, any>  } & StorybookConfigFramework;

export interface NuxtOptions {
}
