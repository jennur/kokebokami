<template>
  <ul>
    <li>
      <nuxt-link :to="switchLocalePath('no')">Norsk (beta)</nuxt-link>
    </li>
    <li>
      <nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: "language-navigation"
};
</script>
