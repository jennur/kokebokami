<template>
  <div>
    <div class="tablet-width padding-horizontal--large margin--auto">
      <breadcrumbs :routes="breadcrumbs" />
    </div>
    <div class="cooks mobile-width padding-horizontal--large margin--auto">
      <h2>Discover other users of Kokebokami</h2>
      <label class="cooks__search">
        <userIcon class="cooks__waving-icon" />
        <input type="text" placeholder="Search for username" v-model="searchTerm" />
      </label>
      <ul class="cooks__result-list margin-top--xlarge padding-left--xlarge" v-if="searchTerm">
        <li class="margin-bottom--large" v-for="cook in cooks" :key="cook[0]">
          <nuxt-link :to="'cooks/' + cook[0]" class="cooks__user-link">
            <img
              class="cooks__user-photo"
              :src="cook[1].photoURL"
              alt="User profile"
              v-if="cook[1].photoURL"
            />
            {{cook[1].displayName}}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import userIcon from "~/assets/graphics/user.svg";
export default {
  name: "cooks",
  components: {
    userIcon
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Cooks" }]
    }
  },
  data() {
    return { searchTerm: "" };
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
