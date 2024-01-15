<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <h1 class="text-4xl font-bold text-center">
    Home Page
  </h1>
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rerum quas doloribus rem cupiditate libero explicabo. Ullam aspernatur, dignissimos in hic officiis aut reiciendis eos voluptatibus mollitia nemo molestiae nostrum?
  </p>
  <div class="text-center">
    <MyNuxtImage />
    {{ msg }}
  </div>
</template>
