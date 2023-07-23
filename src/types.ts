import type {
  BuilderOptions,
  StorybookConfig as StorybookVueViteConfig,
} from '@storybook/vue3-vite';
import type { StorybookConfig as StorybookConfigBase } from '@storybook/types';
import type { UserConfig as ViteConfig } from 'vite';

type FrameworkName = '@storybook/nuxt';
type BuilderName = '@storybook/builder-vite';

export type FrameworkOptions = NuxtOptions & {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: StorybookConfigBase['typescript'];
  previewAnnotations?: StorybookConfigBase['previewAnnotations'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = StorybookVueViteConfig & ViteConfig & StorybookConfigFramework;

export interface NuxtOptions {
  enableIvy?: boolean;
  enableNgcc?: boolean;
}
