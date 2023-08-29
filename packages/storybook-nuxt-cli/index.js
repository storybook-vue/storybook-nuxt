#!/usr/bin/env node

/* eslint-disable @typescript-eslint/indent */

const { program } = require('commander')
const { initStorybook } = require('./init')

// ... Your other code ...

// Define the init command
program
    .command('init')
    .description('Initialize the Storybook configuration')
    .action(() => {
        // ... perform the initialization ...
        initStorybook()
    })

// Parse command-line arguments
program.parse(process.argv)
