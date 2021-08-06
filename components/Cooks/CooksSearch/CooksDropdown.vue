<template>
  <ul class="cooks_result-list padding-left-xl">
    <li v-for="cook in searchResult" :key="cook.id">
      <nuxt-link
        :to="localePath(`/cooks/${cook.path}/`)"
        class="cooks_user-link"
      >
        <div
          v-if="cook.photoURL"
          role="img"
          class="cooks_user-photo"
          :style="`background-image: url(${cook.photoURL});`"
          aria-label="User profile picture"
        />
        <span v-else class="cooks_user-photo" />
        {{ cook.displayName }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
import allUsers from "~/mixins/allUsers.js";

export default {
  name: "cooks-dropdown",
  props: {
    searchTerm: {
      type: String,
      default: ""
    },
    searchResult: {
      type: Array,
      default: () => []
    }
  }
};
</script>
