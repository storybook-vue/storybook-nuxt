import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index' , format: 'esm' },
    // Preset
    { input: 'src/preset',  ext: 'ts' , format: 'esm' },
    // Runtime dirs
    { input: 'src/preview', ext: 'ts' ,format: 'esm' },
      
  ],
  files :[
    'template/**/*',
  ],
 
  hooks: {
    'mkdist:entry:options' (_ctx, _entry, mkdistOptions) {
      mkdistOptions.addRelativeDeclarationExtensions = true
    }
  },
  rollup: {
    emitCJS: true,
  },
  externals: [
    '#app/entry',
    'nuxt/schema',
    'nuxt/app',
    '@storybook/types',
    '@vue/shared',
    '@unhead/vue'
  ],
  failOnWarn: false
})