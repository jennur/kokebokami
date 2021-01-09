<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div
      class="cooks container container--center mobile-width margin-top--xlarge margin--auto"
    >
      <div v-if="user && user.id">
        <h2>{{ $t("cooks.headline") }}</h2>
        <cooks-search />
      </div>
      <div v-else class="container container--center">
        <h2>{{ $t("cooks.loginHeadline") }}</h2>
        <div>
          <nuxt-link
            :to="localePath('/login/')"
            class="button button-sm button--green"
            >{{ $t("loginText") }}</nuxt-link
          >
        </div>
        <cooksSilhouettes class="illustration--cooks" />
      </div>
    </div>
    <div v-if="user && user.id" class="margin-top--xlarge">
      <Tabs
        class="margin-top--xxlarge"
        :tabTitles="[$t('cooks.tabs.following'), $t('cooks.tabs.followers')]"
        @switchTab="index => handleTabSwitch(index)"
      >
        <cooks-list
          v-if="activeTabIndex == 0"
          :cooks="followed"
          :emptyListMessage="$t('cooks.followedEmptyListMessage')"
          class="margin-top--large"
        />
        <cooks-list
          v-if="activeTabIndex == 1"
          :cooks="followers"
          :emptyListMessage="$t('cooks.followersEmptyListMessage')"
          class="margin-top--large"
        />
      </Tabs>
    </div>
  </div>
</template>
<script>
import user from "~/mixins/user.js";
import connectedUsers from "~/mixins/followed-and-followers.js";

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
  mixins: [user, connectedUsers],
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("navigation.cooks") }
      ];
    }
  },
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
