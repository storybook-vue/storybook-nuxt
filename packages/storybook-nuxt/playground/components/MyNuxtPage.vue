<script setup>
import { useRouter } from 'vue-router'

const router = useRouter() //

router.beforeEach((to, from, next) => {
  next()
})

router.push('/')
</script>

<template>
  <div class="overflow-visible" style="padding: 40px;">
    <div class="flex justify-center items-center h-full" style="display: flex;  padding: 20px;">
      <my-button>
        <NuxtLink to="/" class="n-link-base">
          Home
        </NuxtLink>
      </my-button>
      <my-button>
        <NuxtLink to="/about" class="n-link-base">
          About
        </NuxtLink>
      </my-button>

      <my-button>
        <NuxtLink to="/parent" class="n-link-base">
          Parent (index)
        </NuxtLink>
      </my-button>

      <my-button>
        <NuxtLink to="/parent/b" class="n-link-base">
          Parent (b)
        </NuxtLink>
      </my-button>
      <my-button class="n-link-base" @click="$router.push(`/parent/reload-${(Math.random() * 100).toFixed()}`)">
        Keyed child
      </my-button>
      <my-button class="n-link-base" @click="$router.push(`/parent/static-${(Math.random() * 100).toFixed()}`)">
        Non-keyed child
      </my-button>
    </div>
  </div>

  <div class="text-center">
    <NuxtPage />
  </div>
  <div class="text-center p-4 op-50">
    Current route: <code>{{ $route.path }}</code>
  </div>
</template>
