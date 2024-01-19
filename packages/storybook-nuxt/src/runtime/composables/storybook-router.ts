import { useNuxtApp } from 'nuxt/app'

export function useStorybookRouter() {
  const router = useNuxtApp().$router
  return router
}
