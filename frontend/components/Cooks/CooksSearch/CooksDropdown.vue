<template>
  <ul class="cooks__result-list padding-left--xlarge">
    <li v-for="cook in searchResult" :key="cook.id">
      <nuxt-link
        :to="localePath(`/cooks/${cook.path}/`)"
        class="cooks__user-link"
      >
        <div
          v-if="cook.photoURL"
          role="img"
          class="cooks__user-photo"
          :style="`background-image: url(${cook.photoURL});`"
          aria-label="User profile picture"
        />
        <span v-else class="cooks__user-photo" />
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
