<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div
      class="cooks container container--center mobile-width margin-top--xlarge margin--auto"
    >
      <div v-if="user && user.id">
        <h2>Discover cooks of Kokebokami</h2>
        <cooks-search />
      </div>
      <div v-else class="container container--center">
        <h2>Log in to discover cooks of Kokebokami</h2>
        <div>
          <nuxt-link to="/login" class="button button--small button--green"
            >Log in</nuxt-link
          >
        </div>
        <cooksSilhouettes class="illustration--cooks" />
      </div>
    </div>
    <div v-if="user && user.id" class="margin-top--xlarge">
      <Tabs
        class="margin-top--xxlarge"
        :tabTitles="['Currently following', 'Followers']"
        @switchTab="index => handleTabSwitch(index)"
      >
        <cooks-list
          v-if="activeTabIndex == 0"
          :cooks="followed"
          emptyListMessage="You are not following anyone right now 🤷🏽. Follow cooks to get easier access to their profile and see their recipes."
        />
        <cooks-list
          v-if="activeTabIndex == 1"
          :cooks="followers"
          emptyListMessage="You don't have any followers yet 🤷🏻‍♀️"
        />
      </Tabs>
    </div>
  </div>
</template>
<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import connectedUsers from "~/mixins/connectedUsers.js";

import Tabs from "~/components/Tabs.vue";
import CooksSearch from "~/components/Cooks/CooksSearch/CooksSearch.vue";
import CooksList from "~/components/Cooks/CooksList.vue";
import cooksSilhouettes from "~/assets/graphics/illustrations/cooks.svg";
export default {
  name: "cooks",
  components: {
    Tabs,
    CooksSearch,
    CooksList,
    cooksSilhouettes
  },
  head() {
    return {
      title: `Discover cooks | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/cooks/"
        }
      ]
    };
  },
  data() {
    return {
      activeTabIndex: 0,
      showFollowedCooks: true,
      showFollowers: false
    };
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Cooks" }]
    }
  },
  mixins: [user, allUsers, connectedUsers],
  methods: {
    handleTabSwitch(index) {
      this.activeTabIndex = index;
    },
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
