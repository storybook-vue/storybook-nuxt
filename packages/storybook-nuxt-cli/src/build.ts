import { spawn } from 'node:child_process'

import path from 'node:path'
import { existsSync } from 'node:fs'

// Unicode icons for better display
const CHECKMARK = '\u2714' // ✔
const CROSSMARK = '\u274C' // ❌
const STARTMARK = '\u25B6' // ▶

const logger = console

async function buildStorybook() {
  logger.log(`${STARTMARK} Building Storybook ...`)
  logger.log()
  // Path to the project root
  const projectRoot = process.cwd()

  logger.info('🔌 projectRoot :', projectRoot)

  const buildNuxtProcess = spawn('npx', ['storybook', 'build', '--output-dir', '.output/pub'], {
    cwd: projectRoot,
    stdio: 'inherit',
  })
  buildNuxtProcess.on('close', async (code) => {
    if (code !== 0)
      logger.error(`${CROSSMARK} nuxt build failed with code ${code}`)

    else
      logger.log(`${CHECKMARK} nuxt build successfully!`)
  })

  // Install required packages using pnpm
}

// Function to detect the package manager
export function detectPackageManager() {
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

export { buildStorybook }
