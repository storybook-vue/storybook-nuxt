async function initNuxt() {
  const { useStorybook } = await import('./runtime/composables/storybook')
  useStorybook()
}
initNuxt()
export default initNuxt
