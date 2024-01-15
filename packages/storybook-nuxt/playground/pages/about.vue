<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <h1>About page</h1>
  <MyNuxtImage />
  <div>
    {{ msg }}
  </div>
</template>
