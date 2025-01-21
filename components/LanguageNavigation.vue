<template>
  <client-only>
    <ul>
      <li>
        <NuxtLink :to="$switchLocalePath('no')">Norsk</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
      </li>
    </ul>
  </client-only>
</template>

<script setup></script>
