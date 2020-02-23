<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div
      class="cooks container container--center mobile-width margin-top--xlarge margin--auto"
    >
      <h2>Discover other users of Kokebokami</h2>
      <cooks-search />
    </div>
    <div class="margin-top--xlarge">
      <div class="flex-row">
        <h4
          id="following-tab"
          @click="event => toggleCooks(event)"
          :class="
            'tab margin-right--large ' +
              (showFollowedCooks ? 'tab--active' : '')
          "
        >
          Currently following ({{ this.followedCooks.length }})
        </h4>
        <h4 class="margin-right--large">|</h4>
        <h4
          id="followers-tab"
          @click="event => toggleCooks(event)"
          :class="'tab ' + (showFollowers ? 'tab--active' : '')"
        >
          Followers ({{ this.followers.length }})
        </h4>
      </div>
      <cooks-list :cooks="followedCooks" v-if="showFollowedCooks" />
      <cooks-list :cooks="followers" v-if="showFollowers" />
    </div>
  </div>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
import CooksSearch from "~/components/Cooks/CooksSearch/CooksSearch.vue";
import CooksList from "~/components/Cooks/CooksList.vue";

export default {
  name: "cooks",
  components: {
    CooksSearch,
    CooksList
  },
  data() {
    return { showFollowedCooks: true, showFollowers: false };
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Cooks" }]
    }
  },
  mixins: [user],
  computed: {
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
