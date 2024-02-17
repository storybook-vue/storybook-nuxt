<script setup>
const reloads = useState('reload', () => 0)
// eslint-disable-next-line max-statements-per-line
onMounted(() => { reloads.value++ })
</script>

<template>
  <h4>
    Child reloaded: {{ reloads }}
  </h4>
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rerum quas doloribus rem cupiditate libero explicabo. Ullam aspernatur, dignissimos in hic officiis aut reiciendis eos voluptatibus mollitia nemo molestiae nostrum?
  </p>
</template>
