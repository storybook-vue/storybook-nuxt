<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <h1>Index page</h1>
  <div>
    <MyNuxtImage />
  </div>
  <div>
    {{ msg }}
  </div>
</template>
