<template>
  <div>
    <div class="tablet-width padding-horizontal--large margin--auto">
      <breadcrumbs :routes="breadcrumbs" />
    </div>
    <div
      class="cooks container container--center mobile-width padding-horizontal--large margin-top--xlarge margin--auto"
    >
      <h2>Discover other users of Kokebokami</h2>
      <div class="cooks__search margin--auto">
        <label>
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
    <div class="tablet-width padding-horizontal--large margin--auto margin-top--xlarge">
      <div class="flex-row">
        <h3
          id="following-tab"
          @click="event => toggleCooks(event)"
          :class="'tab margin-right--large ' + (showFollowedCooks ? 'tab--active':'')"
        >Currently following ({{this.followedCooks.length}})</h3>
        <h3 class="margin-right--large">|</h3>
        <h3
          id="followers-tab"
          @click="event => toggleCooks(event)"
          :class="'tab ' + (showFollowers ? 'tab--active':'')"
        >Followers ({{this.followers.length}})</h3>
      </div>
      <cooks-list :cooks="followedCooks" v-if="showFollowedCooks" />
      <cooks-list :cooks="followers" v-if="showFollowers" />
    </div>
  </div>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
import userIcon from "~/assets/graphics/user.svg";
import CooksList from "~/components/CooksList.vue";

export default {
  name: "cooks",
  components: {
    userIcon,
    CooksList
  },
  data() {
    return { searchTerm: "", showFollowedCooks: true, showFollowers: false };
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Cooks" }]
    }
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
    },
    followers() {
      let users = this.$store.getters.allUsers;
      let followerUserData = [];
      let followers =
        this.user && this.user.followers
          ? Object.entries(this.user.followers)
          : [];
      if (followers.length) {
        users.forEach(user => {
          followers.forEach(follower => {
            if (user[0] === follower[1]) {
              followerUserData.push(user);
            }
          });
        });
      }
      return followerUserData;
    }
  },
  methods: {
    toggleCooks(event) {
      if (event.target.id === "followers-tab" && !this.showFollowers) {
        this.showFollowers = !this.showFollowers;
        this.showFollowedCooks = !this.showFollowedCooks;
      } else if (
        event.target.id === "following-tab" &&
        !this.showFollowedCooks
      ) {
        this.showFollowers = !this.showFollowers;
        this.showFollowedCooks = !this.showFollowedCooks;
      }
    }
  }
};
</script>
