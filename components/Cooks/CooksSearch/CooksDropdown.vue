<template>
  <ul class="cooks_result-list padding-left-xl">
    <li v-for="cook in cooks" :key="cook.id">
      <NuxtLink
        :to="$localePath(`/cooks/${cook.path}`)"
        class="cooks_user-link"
      >
        <div
          v-if="cook.photoURL"
          role="img"
          class="cooks_user-photo"
          :style="`background-image: url(${cook.photoURL});`"
          aria-label="User profile picture"
        ></div>
        <span v-else class="cooks_user-photo"></span>
        {{ cook.displayName }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  searchTerm: {
    type: String,
    default: ""
  },
  cooks: {
    type: Array,
    default: () => []
  }
});
</script>
