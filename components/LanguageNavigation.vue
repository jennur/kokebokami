<template>
  <ul>
    <li>
      <nuxt-link :to="switchLocalePath('no')">Norsk</nuxt-link>
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
