<template>
  <div class="share-form-container">
    <expand-transition :show="open">
      <form class="share-form" v-on:submit.prevent>
        <h4>Share this recipe with another user</h4>
        <p class="margin-top--none margin-bottom--large">
          The recipe will show up under your friend's "Recipes shared with me"
          tab in his/hers cookbook.
        </p>
        <label class="margin-bottom--large">
          User's email address:
          <input
            type="email"
            placeholder="john.doe@example.com"
            v-model="email"
          />
        </label>
        <button @click="shareRecipe" class="button button--small">Share</button>
      </form>
      <div class="system-message margin-top--large">{{ systemMessage }}</div>
    </expand-transition>
  </div>
</template>
<script>
import { db } from "~/plugins/firebase.js";
import ExpandTransition from "~/components/Transitions/Expand.vue";
export default {
  name: "share-form",
  components: {
    ExpandTransition
  },
  data() {
    return { email: "", systemMessage: "" };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: null
    }
  },
  methods: {
    shareRecipe() {
      const realThis = this;
      const emailValue = this.email;
      const recipeKey = this.recipeKey;
      const userRef = this.$fireDb.ref("users");
      userRef
        .once("value", snapshot => {
          let userID = null;
          let username = "";
          let existingEmailCheck = 1;
          snapshot.forEach(user => {
            if (user.val().email === emailValue) {
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
                      realThis.systemMessage =
                        "Successfully shared with " + username;
                    } else
                      realThis.systemMessage =
                        "This recipe is already shared with " + username;
                  } else {
                    recipeRef.push(userID);
                    realThis.systemMessage =
                      "Successfully shared with " + username;
                  }
                });
              } else {
                console.log("Error: No recipeKey found in shareRecipe");
              }
              existingEmailCheck *= 0;
            }
          });
          if (existingEmailCheck === 1) {
            realThis.systemMessage =
              "This email address does not exist in the database";
          }
        })

        .catch(error => {
          realThis.systemMessage = error.message;
          console.log("ERROR SHARING RECIPE::: " + error);
        });
    }
  }
};
</script>
