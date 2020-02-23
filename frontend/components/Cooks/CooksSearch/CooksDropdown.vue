<template>
  <ul class="cooks__result-list margin-top--xlarge padding-left--xlarge">
    <li v-for="cook in cooks" :key="cook[0]">
      <nuxt-link :to="'cooks/' + cook[0]" class="cooks__user-link">
        <img
          v-if="cook[1].photoURL"
          class="cooks__user-photo"
          :src="cook[1].photoURL"
          alt="User profile"
        />
        <span v-else class="cooks__user-photo" />
        {{ cook[1].displayName }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "cooks-dropdown",
  props: {
    searchTerm: {
      type: String,
      default: ""
    }
  },
  computed: {
    cooks() {
      let searchTerm = this.searchTerm;
      let users = this.$store.getters.allUsers;
      return users.filter(user => {
        return user[1].displayName
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase());
      });
    }
  }
};
</script>
