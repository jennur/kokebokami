<template>
  <ul>
    <li>
      <NuxtLink :to="$switchLocalePath('no')">Norsk</NuxtLink>
    </li>
    <li>
      <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
    </li>
  </ul>
</template>

<script>

export default {
  name: "language-navigation"
};
</script>
