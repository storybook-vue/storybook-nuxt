<script setup>
const reloads = useState('static', () => 0)
// eslint-disable-next-line max-statements-per-line
onMounted(() => { reloads.value++ })
definePageMeta({
  key: 'static',
})
</script>

<template>
  <h4>
    Child reloaded: {{ reloads }}
  </h4>
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rerum quas doloribus rem cupiditate libero explicabo. Ullam aspernatur, dignissimos in hic officiis aut reiciendis eos voluptatibus mollitia nemo molestiae nostrum?
  </p>
</template>
