<template>
  <div class="share-form-container">
    <expand-transition :show="open">
      <form class="share-form" v-on:submit.prevent>
        <h4>Share this recipe with another user</h4>
        <p class="margin-top--none margin-bottom--large">
          The recipe will show up under your friend's "Recipes shared with me"
          tab in his/hers cookbook.
        </p>
        <fieldset class="flex-row margin-bottom--medium">
          <label class="share-form__followers">
            Share with one of your followers
            <select-component
              class="share-form__select margin-top--medium margin-right--medium"
              :options="followerNames"
              defaultValue="Select a user"
              @select="(option) => selected = option"
            />
          </label>
        </fieldset>
        <button @click="shareRecipe" class="button button--small">Share</button>
      </form>
      <div class="system-message margin-top--large">{{ systemMessage }}</div>
    </expand-transition>
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
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
    },
    recipeKey: {
      type: String,
      default: null
    },
    recipeOwnerID: {
      type: String,
      default: null
    }
  },
  computed: {
    followerNames() {
      return this.followers.map(follower => {
        return follower[1].displayName;
      });
    }
  },
  methods: {
    shareRecipe() {
      const componentThis = this;
      const selectedDisplayName = this.selected;
      const recipeKey = this.recipeKey;
      const userRef = this.$fireDb.ref("users");
      userRef
        .once("value", snapshot => {
          let userID = null;
          let username = "";
          let existingShare = 1;
          snapshot.forEach(user => {
            if (user.val().displayName === selectedDisplayName) {
              userID = user.key;
              username = user.val().displayName;

              if (recipeKey !== null) {
                const recipeRef = this.$fireDb.ref(
                  "recipes/" + recipeKey + "/sharedWith"
                );

                recipeRef.once("value", shares => {
                  if (shares.exists()) {
                    let sharedWith = Object.values(shares.val());

                    if (sharedWith.indexOf(userID) === -1) {
                      recipeRef.push(userID);
                      componentThis.systemMessage = `Successfully shared with ${username}`;
                    } else
                      componentThis.systemMessage = `This recipe is already shared with ${username}`;
                  } else {
                    recipeRef.push(userID);
                    componentThis.systemMessage = `Successfully shared with ${username}`;
                  }
                });
              } else {
                console.log("Error: No recipeKey found in shareRecipe");
              }
              existingShare *= 0;
            }
          });
          if (existingShare === 1) {
            componentThis.systemMessage =
              "This user does not exist in the database";
          }
        })

        .catch(error => {
          componentThis.systemMessage = error.message;
          console.log("Error sharing recipe:", error.message);
        });
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
