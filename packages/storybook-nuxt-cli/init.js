#!/usr/bin/env node

/* eslint-disable @typescript-eslint/indent */

const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')
const console = require('node:console')

// Unicode icons for better display
const CHECKMARK = '\u2714' // ✔
const CROSSMARK = '\u274C' // ❌
const logger = console

function initStorybook() {
    logger.log('Initializing Storybook configuration...')
    logger.log()
        // Path to the project root
    const projectRoot = process.cwd()

    // Path to the .storybook directory
    const storybookDir = path.join(projectRoot, '.storybook')

    // Determine if the project is using TypeScript
    const isTypeScriptProject = fs.existsSync(path.join(projectRoot, 'tsconfig.json'))

    // Determine if the project has a ./src directory
    const hasSrcDirectory = fs.existsSync(path.join(projectRoot, 'src'))
    const sourceFolder = hasSrcDirectory ? 'src' : '.'

    // Choose the appropriate file extension for the configuration files
    const configFileExtension = isTypeScriptProject ? 'ts' : 'js'
    const extensions = isTypeScriptProject ? 'js|jsx|mjs|ts|tsx' : 'js|jsx|mjs'
        // Build the paths for stories based on the source folder
    const storiesPath = path.join(sourceFolder, '../stories')
    const storiesGlob = `${storiesPath}/**/*.stories.@(${extensions})`

    // Load the main and preview template files
    const mainTemplatePath = path.join(__dirname, '.storybook', `main-${configFileExtension}`)
    const previewTemplatePath = path.join(__dirname, '.storybook', `preview-${configFileExtension}`)

    const mainTemplate = fs.readFileSync(mainTemplatePath, 'utf8')
    const previewTemplate = fs.readFileSync(previewTemplatePath, 'utf8')

    // Replace placeholders in the templates with dynamic values
    const mainConfigContent = mainTemplate
        .replace(/\$storiesPath/g, storiesPath)
        .replace(/\$storiesGlob/g, storiesGlob)

    const previewConfigContent = previewTemplate

    // Create the .storybook directory if it doesn't exist
    if (!fs.existsSync(storybookDir))
        fs.mkdirSync(storybookDir)

    // Create the Storybook main config file
    fs.writeFileSync(path.join(storybookDir, `main.${configFileExtension}`), mainConfigContent)

    // Create the Storybook preview config file
    fs.writeFileSync(path.join(storybookDir, `preview.${configFileExtension}`), previewConfigContent)

    logger.log('Install dependencies 📦️')
    logger.log()

    const packageManager = detectPackageManager()

    addDevDependencies()
        // Install required packages using pnpm
    const installProcess = spawn(packageManager, ['install'], {
        cwd: projectRoot,
        stdio: 'inherit',
    })

    installProcess.on('close', (code) => {
        if (code !== 0) {
            logger.error(`${CROSSMARK} Package installation failed with code ${code}`)
        }
 else {
            logger.log(`${CHECKMARK} Packages installed successfully!`)

            addScripts(packageManager)
            copyTemplateFiles(configFileExtension, path.join(sourceFolder, 'stories'))

            logger.log()
            logger.log('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨')
            logger.log('✨✨       🚀️ You can run storybook using           ✨✨')
            logger.log('✨                                                    ✨')
            logger.log(`✨            ${packageManager} storybook dev                      ✨`)
            logger.log('✨                                                    ✨')
            logger.log('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨')
            logger.log()
        }
    })
}

// Function to detect the package manager
function detectPackageManager() {
    if (fs.existsSync(path.join(process.cwd(), 'package-lock.json')))
        return 'npm'

    else if (fs.existsSync(path.join(process.cwd(), 'yarn.lock')))
        return 'yarn'

    else if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml')))
        return 'pnpm'

    return 'npm'
}

function addDevDependencies() {
    const devDependencies = {
        'storybook': 'next',
        '@storybook-vue/nuxt': 'next',
        '@storybook/addon-essentials': 'next',
        '@storybook/addon-interactions': 'next',
        '@storybook/addon-links': 'next',
        '@storybook/blocks': 'next',
        '@storybook/builder-vite': 'next',
        '@storybook/testing-library': '^0.2.0',
        '@storybook/vue3': 'next',
        '@storybook/vue3-vite': 'next',
        '@types/node': '^18.17.5',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',

    }
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = require(packageJsonPath)
    if (packageJson) {
        packageJson.devDependencies = packageJson.devDependencies || {}
        Object.keys(devDependencies).forEach((key) => {
            packageJson.devDependencies[key] = devDependencies[key]
        })
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
        logger.log(`${CHECKMARK} Storybook devDependencies added to package.json `)
    }
 else {
        logger.log(`${CROSSMARK} Sorry, this feature is currently only supported with pnpm.`)
    }
}

function addScripts() {
    // Update package.json with the script
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = require(packageJsonPath)

    if (packageJson) {
        packageJson.scripts = packageJson.scripts || {}
        packageJson.scripts.storybook = 'storybook dev --port 6006'
        packageJson.scripts['build-storybook'] = 'storybook build'
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
        logger.log(`${CHECKMARK} Storybook scripts added to package.json `)
    }
 else {
        logger.log(`${CROSSMARK} Sorry, this feature is currently only supported with pnpm.`)
    }
}

function copyTemplateFiles(extension, storiesPath) {
    // Copy the template files to the project root
    const templateDir = path.join(require.resolve('@storybook-vue/nuxt'), '../../template/cli/', extension)
    const targetDir = path.join(process.cwd(), storiesPath)
    copyFolderRecursive(templateDir, targetDir)
        // Copy the common assets to the project root
    const commonAssetsDir = path.join(__dirname, '.storybook', 'rendererAssets/common')
    copyFolderRecursive(commonAssetsDir, targetDir)
}

function copyFolderRecursive(sourceFolder, destinationFolder) {
    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(destinationFolder))
        fs.mkdirSync(destinationFolder)

    // Read the contents of the source folder
    const files = fs.readdirSync(sourceFolder)

    // Loop through the files in the source folder
    for (const file of files) {
        const sourceFilePath = path.join(sourceFolder, file)
        const destinationFilePath = path.join(destinationFolder, file)

        // Get the file's stats to check if it's a directory or a file
        const stats = fs.statSync(sourceFilePath)

        if (stats.isFile()) {
            // If it's a file, copy it to the destination folder
            fs.copyFileSync(sourceFilePath, destinationFilePath)
        }
 else if (stats.isDirectory()) {
            // If it's a directory, recursively copy it
            copyFolderRecursive(sourceFilePath, destinationFilePath)
        }
    }
}

// Usage example:

module.exports = { initStorybook }
