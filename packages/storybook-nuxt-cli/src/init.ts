// import fs = require('node:fs')
// import path = require('node:path')
import { spawn } from 'node:child_process'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import c from 'picocolors'
import { consola } from 'consola'
import { addModuleToNuxtConfigFile, updatePackageJsonFile } from './add-module'

// Unicode icons for better display
const CHECKMARK = '\u2714' // ✔
const CROSSMARK = '\u274C' // ❌
const STARTMARK = '\u25B6' // ▶

const logger = console
let packageManager

async function initStorybook(start = false, port = 6006, ci = true, enableModule = false) {
  logger.log(`${STARTMARK} Initializing Storybook configuration...`)
  logger.log()
  // Path to the project root
  const projectRoot = process.cwd()
  // Path to the root of the Storybook Nuxt CLI
  const rootDir = path.join(fileURLToPath(import.meta.url), '../..')
  // Path to the .storybook directory
  const storybookDir = path.join(projectRoot, '.storybook')

  // Determine if the project is using TypeScript
  const isTypeScriptProject = existsSync(path.join(projectRoot, 'tsconfig.json'))

  // Determine if the project has a ./src directory
  const hasSrcDirectory = existsSync(path.join(projectRoot, 'src'))
  const sourceFolder = hasSrcDirectory ? 'src' : '.'

  // Choose the appropriate file extension for the configuration files
  const configFileExtension = isTypeScriptProject ? 'ts' : 'js'
  const extensions = isTypeScriptProject ? 'js|jsx|mjs|ts|tsx' : 'js|jsx|mjs'
  // Build the paths for stories based on the source folder
  const storiesPath = path.join(sourceFolder, '../stories')
  const storiesGlob = `${storiesPath}/**/*.stories.@(${extensions})`

  // Load the main and preview template files
  const mainTemplatePath = path.join(rootDir, '.storybook', `main-${configFileExtension}`)
  const previewTemplatePath = path.join(rootDir, '.storybook', `preview-${configFileExtension}`)

  const mainTemplate = readFileSync(mainTemplatePath, 'utf8')
  const previewTemplate = readFileSync(previewTemplatePath, 'utf8')

  // Replace placeholders in the templates with dynamic values
  const mainConfigContent = mainTemplate
    .replace(/\$storiesPath/g, storiesPath)
    .replace(/\$storiesGlob/g, storiesGlob)

  const previewConfigContent = previewTemplate

  // Create the .storybook directory if it doesn't exist
  if (!existsSync(storybookDir))
    mkdirSync(storybookDir)

  // Create the Storybook main config file
  writeFileSync(path.join(storybookDir, `main.${configFileExtension}`), mainConfigContent)

  // Create the Storybook preview config file
  writeFileSync(path.join(storybookDir, `preview.${configFileExtension}`), previewConfigContent)

  logger.log('Install dependencies 📦️')
  logger.log()

  packageManager = detectPackageManager()
  if (!packageManager) {
    // Prompt user to select package manager
    const selectedPackageManager = await consola.prompt<{
      type: 'select'
      options: string[]
    }>('Which package manager would you like to use?', {
      type: 'select',
      options: ['npm', 'pnpm', 'yarn', 'bun'],
    })

    packageManager = selectedPackageManager
  }

  addDevDependencies()
  if (!enableModule)
    addModuleToNuxtConfigFile('@nuxtjs/storybook', projectRoot)
  // Install required packages using pnpm
  const installProcess = spawn(packageManager, ['install'], {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  installProcess.on('close', async (code) => {
    if (code !== 0) {
      logger.error(`${CROSSMARK} Package installation failed with code ${code}`)
    }
    else {
      logger.log(`${CHECKMARK} Packages installed successfully!`)

      await addScripts()
      await copyTemplateFiles(configFileExtension, path.join(sourceFolder, 'stories'))

      logger.log()
      logger.log('📕 Storybook is ready to go! 🚀')
      logger.log()
      logger.log('To start Storybook, run:')
      logger.log()
      logger.log(`  ${c.blue(`${packageManager} run storybook`)} `)
      logger.log()
      if (start) {
        const startProcess = spawn(packageManager, ['storybook', 'dev', '--ci', '--port', `${port}`], {
          cwd: projectRoot,
          stdio: 'inherit',
        })

        startProcess.on('close', (code) => {
          if (code !== 0)
            logger.error(`${CROSSMARK} Storybook failed to start with code ${code}`)
          else
            logger.log(`${CHECKMARK} Storybook started successfully!`)
        })
      }
    }
  })
}

// Function to detect the package manager
function detectPackageManager() {
  if (existsSync(path.join(process.cwd(), 'package-lock.json')))
    return 'npm'

  else if (existsSync(path.join(process.cwd(), 'yarn.lock')))
    return 'yarn'

  else if (existsSync(path.join(process.cwd(), 'pnpm-lock.yaml')))
    return 'pnpm'

  else if (existsSync(path.join(process.cwd(), 'bun.lock')))
    return 'bun'

  return undefined
}

async function addDevDependencies() {
  const devDependencies = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'storybook': 'next',
    '@types/node': '^18.17.5',
    '@storybook/vue3': 'latest',
    '@storybook-vue/nuxt': 'latest',
    '@nuxtjs/storybook': 'latest',
    '@storybook/addon-links': 'lastest',
    '@storybook/builder-vite': 'lastest',
    '@storybook/addon-essentials': 'lastest',
    '@storybook/addon-interactions': 'lastest',
    '@storybook/testing-library': '^0.2.0',
    '@storybook/blocks': 'lastest',
  }

  updatePackageJsonFile(devDependencies)
}

async function addScripts() {
  // Update package.json with the script
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const source = await fsp.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(source)

  if (packageJson) {
    packageJson.scripts = packageJson.scripts || {}
    packageJson.scripts.storybook = 'storybook dev --port 6006'
    packageJson.scripts['build-storybook'] = 'storybook build'
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    logger.log()
    logger.log(`${CHECKMARK} Storybook scripts added to package.json `)
  }
  else {
    logger.log(`${CROSSMARK} Sorry, this feature is currently only supported with pnpm.`)
  }
}

async function copyTemplateFiles(extension, storiesPath) {
  // Copy the template files to the project root
  const packagePath = await getPackageDir('@storybook-vue/nuxt')
  const templateDir = path.join(packagePath, 'template', 'cli', extension)
  const targetDir = path.join(process.cwd(), storiesPath)
  copyFolderRecursive(templateDir, targetDir)
  // Copy the common assets to the project root
  const rootDir = path.join(fileURLToPath(import.meta.url), '../..')
  const commonAssetsDir = path.join(rootDir, '.storybook', 'rendererAssets/common')
  copyFolderRecursive(commonAssetsDir, targetDir)
}

function copyFolderRecursive(sourceFolder, destinationFolder) {
  // Create the destination folder if it doesn't exist
  if (!existsSync(destinationFolder))
    mkdirSync(destinationFolder)

  // Read the contents of the source folder
  const files = readdirSync(sourceFolder)

  // Loop through the files in the source folder
  for (const file of files) {
    const sourceFilePath = path.join(sourceFolder, file)
    const destinationFilePath = path.join(destinationFolder, file)

    // Get the file's stats to check if it's a directory or a file
    const stats = statSync(sourceFilePath)

    if (stats.isFile()) {
      // If it's a file, copy it to the destination folder
      copyFileSync(sourceFilePath, destinationFilePath)
    }
    else if (stats.isDirectory()) {
      // If it's a directory, recursively copy it
      copyFolderRecursive(sourceFilePath, destinationFilePath)
    }
  }
}

// Usage example:
async function getPackageDir(frameworkPackageName) {
//   const packageJsonPath = join(frameworkPackageName, 'package.json')

  try {
    const require = createRequire(import.meta.url)
    const packageDir = path.dirname(require.resolve(path.join(frameworkPackageName, 'package.json'), { paths: [process.cwd()] }))

    return packageDir
  }
  catch (e) {
    logger.error(e)
  }
  throw new Error(`Cannot find ${frameworkPackageName},`)
}

async function initNuxtProject() {
  const startProcess = spawn('npx', ['nuxi', 'init', '.'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  return new Promise<boolean>((resolve, reject) => {
    startProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`${CROSSMARK} Nuxt failed to init ${code}`)
        if (code === 1)
          resolve(true)
        else
          reject(code)
      }
      else {
        logger.log(`${CHECKMARK} Nuxt started successfully!`)
        resolve(true)
      }
    })
  })
}
async function installDependencies() {
  const installProcess = spawn(packageManager, ['install'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
  return new Promise<boolean>((resolve, reject) => {
    installProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`${CROSSMARK} Package installation failed with code ${code}`)
        reject(code)
      }
      else {
        logger.log(`${CHECKMARK} Packages installed successfully!`)
        resolve(true)
      }
    })
  })
}

export { initStorybook, initNuxtProject as initNuxt, installDependencies }
