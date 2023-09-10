#!/usr/bin/env node
import { program } from 'commander'
import { initStorybook } from './init'

// ... Your other code ...

// Define the init command
program
  .command('init')
  .description('Initialize the Storybook configuration')
  .option('-s, --start', 'Start Storybook after initialization')
  .option('-p, --port <port>', 'Port to run Storybook on', '6006')
  .option('-c, --ci', 'Run in CI mode') // avoid interactive prompts and browser opening
  .action((options) => {
    // ... perform the initialization ...
    initStorybook(Boolean(options.start), options.port, options.ci)
  })

// Parse command-line arguments
program.parse(process.argv)
