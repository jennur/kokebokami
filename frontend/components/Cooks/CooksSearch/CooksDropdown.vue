<template>
  <ul class="cooks__result-list padding-left--xlarge">
    <li v-for="cook in cooks" :key="cook[0]">
      <nuxt-link
        :to="localePath(`/cooks/${cook[0]}/`)"
        class="cooks__user-link"
      >
        <div
          v-if="cook[1].photoURL"
          role="img"
          class="cooks__user-photo"
          :style="`background-image: url(${cook[1].photoURL});`"
          aria-label="User profile picture"
        />
        <span v-else class="cooks__user-photo" />
        {{ cook[1].displayName }}
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
    }
  },
  mixins: [allUsers],
  computed: {
    cooks() {
      let searchTerm = this.searchTerm;
      let users = this.allUsers;
      return users.filter(user => {
        return user[1].displayName
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase());
      });
    }
  }
};
</script>
