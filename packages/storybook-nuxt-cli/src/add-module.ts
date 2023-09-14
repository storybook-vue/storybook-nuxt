import { existsSync } from 'node:fs'
import fsp from 'node:fs/promises'
import { relative } from 'node:path'
import { cwd } from 'node:process'
import { consola } from 'consola'
import c from 'picocolors'
import { parseModule } from 'magicast'
import { diffLines } from 'diff'
import path, { join } from 'pathe'

export async function addModuleToNuxtConfigFile(moduleName, cwd) {
  const nuxtConfig = findNuxtConfig(cwd)
  if (!nuxtConfig) {
    consola.error(c.red('Unable to find Nuxt config file in current directory:'), cwd)
    process.exitCode = 1
    printOutManual(moduleName)
    return false
  }

  try {
    const source = await fsp.readFile(nuxtConfig, 'utf-8')
    const mod = await parseModule(source, { sourceFileName: nuxtConfig })
    const config = mod.exports.default.$type === 'function-call'
      ? mod.exports.default.$args[0]
      : mod.exports.default

    config.modules ||= []
    if (typeof config.modules === 'object' && !config.modules.includes(moduleName))
      config.modules.push(moduleName)

    const generated = mod.generate().code

    if (source.trim() === generated.trim()) {
      consola.info(c.yellow('x'))
    }
    else {
      consola.log('')
      consola.log('We are going to update the Nuxt config with with the following changes:')
      consola.log(c.bold(c.green(`./${relative(cwd, nuxtConfig)}`)))
      consola.log('')
      printDiffToCLI(source, generated)
      consola.log('')

      await fsp.writeFile(nuxtConfig, `${generated.trimEnd()}\n`, 'utf-8')
    }
  }
  catch (err) {
    consola.error(c.red('Unable to update Nuxt config file automatically'))
    process.exitCode = 1
    printOutManual(moduleName)
    return false
  }
}

function findNuxtConfig(cwd) {
  const names = [
    'nuxt.config.ts',
    'nuxt.config.js',
  ]

  for (const name of names) {
    const path = join(cwd, name)
    if (existsSync(path))
      return path
  }
}
function printOutManual(moduleName: boolean) {
  consola.info(c.yellow('To manually enable Storybook Module, add the following to your Nuxt config modules :'))
  consola.info(c.cyan(`\n ${moduleName} \n`))
}

// diff `from` and `to` by line and pretty print to console with line numbers, using the `diff` package
function printDiffToCLI(from, to) {
  const diffs = diffLines(from.trim(), to.trim())
  let output = ''

  let no = 0

  // TODO: frame only the diff parts
  for (const diff of diffs) {
    const lines = diff.value.trimEnd().split('\n')
    for (const line of lines) {
      if (!diff.added)
        no += 1
      if (diff.added)
        output += c.green(`+    | ${line}\n`)
      else if (diff.removed)
        output += c.red(`-${no.toString().padStart(3, ' ')} | ${line}\n`)
      else
        output += c.gray(`${c.dim(`${no.toString().padStart(4, ' ')} |`)} ${line}\n`)
    }
  }

  consola.log(output.trimEnd())
}

export async function updatePackageJsonFile(devDependencies) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const source = await fsp.readFile(packageJsonPath, 'utf-8')

    const packageJson = source ? JSON.parse(source) : {}

    packageJson.devDependencies ||= []
    if (typeof packageJson.devDependencies === 'object') {
      for (const [name, version] of Object.entries(devDependencies))
        packageJson.devDependencies[name] = version
    }

    const generated = JSON.stringify(packageJson, null, 2)

    if (source.trim() === generated.trim()) {
      consola.info(c.yellow('x'))
    }
    else {
      consola.log('')
      consola.log(`We are going to update ${c.blue('package.json')} with the following changes:`)
      consola.log(c.bold(c.green(`./${relative(cwd(), packageJsonPath)}`)))
      consola.log('')
      printDiffToCLI(source, generated)
      consola.log('')

      await fsp.writeFile(packageJsonPath, `${generated.trimEnd()}\n`, 'utf-8')
    }
  }
  catch (err) {
    consola.error(c.red('Unable to update package.json file automatically'), err)
    process.exitCode = 1

    return false
  }
}
