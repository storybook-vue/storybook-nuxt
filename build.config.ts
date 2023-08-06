import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index' },
    // Preset
    { input: 'src/preset' },
    // Runtime dirs
    { input: 'src/preview', outDir:'dist/', ext: 'js' },
      
  ],
  
  rollup: {
    emitCJS: true,
  },
  externals: [

    'nuxt/schema',
    'nuxt/app',
    '@storybook/types',
    '@vue/shared',
    '@unhead/vue',
    '@nuxt/devtools-kit',
  ],
  failOnWarn: false
})