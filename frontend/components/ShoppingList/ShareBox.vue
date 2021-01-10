<template>
  <modal-box :open="open" :dark-bg="false" @close="$emit('close-modal')">
    <h4>{{`${$t("shoppingLists.share.share")} '${listTitle}' ${$t("shoppingLists.share.withFollower")}` }}</h4>

    <form class="share-form" v-on:submit.prevent>
      <fieldset class="flex-row flex-row--align-center flex-row--nowrap margin-bottom-md">
        <label class="share-form_followers">
          <select-component
            class="share-form_select margin-right-xl"
            :options="followerNames"
            defaultValue="Select a user"
            @select="option => (selected = option)"
          />
        </label>

         <hover-info-box class="margin-left-sm margin-bottom-sm">
          {{ $t("shoppingLists.share.shareWithFollowerNote") }}
        </hover-info-box>
      </fieldset>

      <button @click="shareShoppingList" class="button button-sm margin-top-md">
        Share
      </button>
    </form>

    <expand-transition :show="!!systemMessage">
      <div class="system-message margin-top-lg">
        {{ systemMessage }}
      </div>
    </expand-transition>
  </modal-box>
</template>
<script>
import allUsers from "~/mixins/allUsers.js";
import user from "~/mixins/user.js";
import connectedUsers from "~/mixins/followed-and-followers.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import HoverInfoBox from "~/components/HoverInfoBox";
import ModalBox from "~/components/ModalBox";

export default {
  name: "share-form",
  components: {
    ModalBox,
    ExpandTransition,
    SelectComponent,
    HoverInfoBox
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
    },
    listTitle: {
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
                  this.systemMessage = `This shopping list is already shared with ${follower.displayName} `;
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
                    this.systemMessage = `Successfully shared with ${follower.displayName}`;
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
          this.systemMessage = "An error occured while sharing";
        }
      } else {
        this.systemMessage = "We were unable to find this user in the database";
      }
    }
  }
};
</script>
