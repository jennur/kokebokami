<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="cooks container container--center mobile-width margin-top-xl margin-auto">
      <div v-if="user && user.id">
        <h2>{{ $t("cooks.headline") }}</h2>
        <cooks-search />
      </div>

      <div v-else class="container container--center">
        <h2>{{ $t("cooks.loginHeadline") }}</h2>
        <div>
          <button class="button button-sm button--green"
                  @click="$store.dispatch('SHOW_LOGIN_MODAL', {open: true, headline: 'Log in to discover cooks'})"
          >
            {{ $t("loginText") }}
          </button>
        </div>
        <cooksSilhouettes class="illustration--cooks" />
      </div>
    </div>

    <div v-if="user && user.id" class="margin-top-xl">
      <Tabs
        class="margin-top-2xl"
        :tabTitles="[$t('cooks.tabs.following'), $t('cooks.tabs.followers')]"
        @switchTab="index => handleTabSwitch(index)"
      >
        <cooks-list
          v-if="activeTabIndex == 0"
          :cooks="followed"
          :emptyListMessage="$t('cooks.followedEmptyListMessage')"
          class="margin-top-lg"
        />
        <cooks-list
          v-if="activeTabIndex == 1"
          :cooks="followers"
          :emptyListMessage="$t('cooks.followersEmptyListMessage')"
          class="margin-top-lg"
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
      if(!this.followed.length && !this.followers.length) {
        this.getFollowersAndFollowed();
      }
    }
  }
};
</script>
