<template>
  <div class="share-form">
    <expand-transition :show="open">
      <form class="share-form" v-on:submit.prevent>
        <h4>Share this shopping list with one of your followers</h4>
        <p class="margin-top--none margin-bottom--large">
          The shopping list will show up among your friend's shopping lists.
        </p>
        <fieldset class="flex-row margin-bottom--medium">
          <label class="share-form__followers">
            <select-component
              class="share-form__select margin-top--medium margin-right--medium"
              :options="followerNames"
              defaultValue="Select a user"
              @select="option => (selected = option)"
            />
          </label>
        </fieldset>
        <button
          @click="$emit('share', selectedFollower)"
          class="button button--small"
        >
          Share
        </button>
      </form>
    </expand-transition>
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";

import allUsers from "~/mixins/allUsers.js";
import user from "~/mixins/user.js";
import connectedUsers from "~/mixins/connectedUsers.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";

export default {
  name: "share-form",
  components: {
    ExpandTransition,
    SelectComponent
  },
  mixins: [user, allUsers, connectedUsers],
  data() {
    return {
      searchTerm: "",
      selected: "",
      shareByEmail: false,
      email: "",
      systemMessage: ""
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    followerNames() {
      return (
        this.followers &&
        this.followers.map(follower => {
          return follower[1].displayName;
        })
      );
    },
    selectedFollower() {
      let follower = this.followers.filter(follower => {
        return follower[1].displayName === this.selected;
      });
      return (follower && follower[0]) || [];
    }
  }
};
</script>
