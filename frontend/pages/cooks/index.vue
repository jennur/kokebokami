<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="cooks container container--center mobile-width margin-top--xlarge margin--auto">
      <div v-if="user && user.id">
        <h2>Discover cooks of Kokebokami</h2>
        <cooks-search />
      </div>
      <div v-else>
        <h2>Log in to discover cooks of Kokebokami</h2>
        <nuxt-link to="/login" class="button button--small button--green">Log in</nuxt-link>
      </div>
    </div>
    <div class="margin-top--xlarge">
      <Tabs
        v-if="user && user.id"
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

export default {
  name: "cooks",
  components: {
    Tabs,
    CooksSearch,
    CooksList,
  },
  head() {
    return {
      title: `Discover cooks | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/cooks/",
        },
      ],
    };
  },
  data() {
    return {
      activeTabIndex: 0,
      showFollowedCooks: true,
      showFollowers: false,
    };
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Cooks" }],
    },
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
    },
  },
};
</script>
