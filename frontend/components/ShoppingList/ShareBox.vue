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
          @click="shareShoppingList"
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
import connectedUsers from "~/mixins/followed-and-followers.js";

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
    },
    listKey: {
      type: String,
      default: ""
    }
  },
  computed: {
    followerNames() {
      return (
        this.followers && this.followers.map(follower => follower.displayName)
      );
    },
    selectedFollower() {
      let follower = this.followers.filter(follower => follower.displayName === this.selected)[0];
      return follower || [];
    }
  },
  methods: {
    shareShoppingList() {
      let follower = this.selectedFollower;

      if (follower && follower.id !== "") {
        let ownersRef = this.$fire.database.ref(`shoppingLists/${this.listKey}/owners`);

        try {
          ownersRef.once("value", snapshot => {
            if (snapshot.exists()) {
              let owners = Object.values(snapshot.val());
              let shared = false;
              owners.forEach(user => {
                if (user.id === follower.id) {
                  this.$emit('systemMessage', `This shopping list is already shared with ${follower.displayName} `);
                  shared = true;
                }
              });

              if (!shared) {
                ownersRef
                  .push({
                    id: follower.id,
                    displayName: follower.displayName,
                    sharedFrom: { id: this.user.id, displayName: this.user.displayName }
                  })
                  .then(() => {
                    this.$emit('systemMessage', `Successfully shared with ${follower.displayName}`);
                    this.$emit("update");
                    if (!follower.notificationsOff || !follower.notificationsOff.shoppingLists) {
                      this.$emit('shared', follower);
                    }
                  });
              }
            }
          });
        } catch (error) {
          console.log("Error while sharing:", error.message);
          this.$emit('systemMessage', "An error occured while sharing");
        }
      } else {
        this.$emit('systemMessage', "We were unable to find this user in the database");
      }
    }
  }
};
</script>
