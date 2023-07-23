

import { StorybookConfigVite } from '@storybook/builder-vite';
import type {  StorybookConfig as StorybookConfigBase } from '@storybook/types';

type FrameworkName = '@storybook/nuxt';
type BuilderName = '@storybook/builder-vite';
type RendererName = '@storybook/vue3';



type StorybookConfigFramework = {
  framework: FrameworkName;
  builder: BuilderName
  renderer: RendererName;    
  typescript?: StorybookConfigBase['typescript'];
  previewAnnotations?: StorybookConfigBase['previewAnnotations'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = StorybookConfigVite & StorybookConfigFramework;

export interface NuxtOptions {
  enableIvy?: boolean;
  enableNgcc?: boolean;
}
