<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <h3 class="storybook">
    Home Page
  </h3>
  <p class="storybook">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rerum quas doloribus rem cupiditate libero explicabo. Ullam aspernatur, dignissimos in hic officiis aut reiciendis eos voluptatibus mollitia nemo molestiae nostrum?
  </p>
  <div class="text-center">
    {{ msg }}
  </div>
  <MyNuxtImage />
</template>
