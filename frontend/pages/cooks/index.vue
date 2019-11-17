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
    <div v-if="followedCooks">
      <div
        class="flex-row following-cooks tablet-width padding-horizontal--large margin--auto margin-top--xlarge"
      >
        <nuxt-link
          :to="'cooks/' + followedCook[0]"
          class="following-cooks__cook margin--small"
          v-for="followedCook in followedCooks"
          :key="followedCook[0]"
        >
          <img
            class="following-cooks__img margin-right--xlarge"
            :src="followedCook[1].photoURL"
            :alt="followedCook[1].displayName + '´s profile picture'"
            v-if="followedCook[1].photoURL"
          />
          <div class="flex-column">
            <h2
              class="heading--display-font margin-bottom--small margin--none"
            >{{followedCook[1].displayName ? followedCook[1].displayName : ""}}</h2>
            <p
              class="following-cooks__biography margin--none"
            >{{followedCook[1].biography ? (followedCook[1].biography.substring(0,70) + "...") : "This user did not write a biography yet."}}</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
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
  mixins: [user],
  computed: {
    cooks() {
      let searchTerm = this.searchTerm;
      let users = this.$store.getters.allUsers;
      return users.filter(user => {
        return user[1].displayName
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase());
      });
    },
    followedCooks() {
      let users = this.$store.getters.allUsers;
      let followingUserData = [];
      let following =
        this.user && this.user.following
          ? Object.entries(this.user.following)
          : [];
      if (users && following.length) {
        users.forEach(user => {
          following.forEach(follower => {
            if (user[0] === follower[1]) {
              followingUserData.push(user);
            }
          });
        });
      }
      return followingUserData;
    }
  }
};
</script>
