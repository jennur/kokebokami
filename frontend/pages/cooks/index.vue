<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="cooks container container--center mobile-width margin-top--xlarge margin--auto">
      <h2>Discover other users of Kokebokami</h2>
      <cooks-search />
    </div>
    <div class="margin-top--xlarge">
      <Tabs
        :tabTitles="['Currently following', 'Followers']"
        @switchTab="(index) => handleTabSwitch(index)"
      >
        <cooks-list :cooks="followed" v-if="activeTabIndex == 0" />
        <cooks-list :cooks="followers" v-if="activeTabIndex == 1" />
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
    CooksList
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
