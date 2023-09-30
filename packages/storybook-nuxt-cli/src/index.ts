#!/usr/bin/env node
import { program } from 'commander'
import { initNuxt, initStorybook } from './init'

// ... Your other code ...

// Define the init command
program
  .command('init')
  .description('Initialize the Storybook configuration')
  .option('-s, --start', 'Start Storybook after initialization')
  .option('-m, --enable-module ', 'enable module in nuxt.config')
  .option('-p, --port <port>', 'Port to run Storybook on', '6006')
  .option('-c, --ci', 'Run in CI mode') // avoid interactive prompts and browser opening
  .action(async (options) => {
    // if current directory is empty, create a new project

    const nuxt = await initNuxt().catch(() => null)
    if (nuxt)
      initStorybook(Boolean(options.start), options.port, options.ci, Boolean(options.enableModule))
  })

// Parse command-line arguments
program.parse(process.argv)
