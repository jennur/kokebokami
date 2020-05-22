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
          Currently following ({{ followed && followed.length }})
        </h4>
        <h4 class="margin-right--large">|</h4>
        <h4
          id="followers-tab"
          @click="event => toggleCooks(event)"
          :class="'tab ' + (showFollowers ? 'tab--active' : '')"
        >
          Followers ({{ followers && followers.length }})
        </h4>
      </div>
      <cooks-list :cooks="followed" v-if="showFollowedCooks" />
      <cooks-list :cooks="followers" v-if="showFollowers" />
    </div>
  </div>
</template>
<script>
import user from "~/mixins/user.js";
import connectedUsers from "~/mixins/getConnectedUsers.js";
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
  mixins: [user, connectedUsers],
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
