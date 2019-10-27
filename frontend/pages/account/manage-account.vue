<template>
  <div class="container mobile-width">
    <h2 class="heading--display-font margin-bottom--large">Your account details</h2>
    <div class="flex-row-container">
      <button
        class="button button--transparent margin-top--large"
        @click="deleteAccount"
      >Delete my account</button>
      <p>{{systemMessage}}</p>
    </div>
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import RecipesList from "~/components/RecipesList.vue";
import { auth, db } from "~/plugins/firebase.js";
export default {
  name: "manage-account",
  data() {
    return { systemMessage: "" };
  },
  components: {},
  mixins: [user],
  computed: {},
  methods: {
    deleteAccount() {
      let user = auth.currentUser;
      let userUID = this.user.id;
      const realThis = this;
      if (
        confirm(
          "Are you sure you want to delete your account and all your recipes?\nThis operation cannot be undone."
        )
      ) {
        let recipesRef = db.ref("recipes").orderByChild("ownerID");

        recipesRef
          .once("value", recipes => {
            recipes.forEach(recipe => {
              if (recipe.val().ownerID === user.uid)
                db.ref("recipes/" + recipe.key)
                  .remove()
                  .then(() => {
                    console.log("Successfully deleted recipe::: " + recipe.key);
                  })
                  .catch(error => {
                    console.log(error.message);
                  });
            });
          })
          .then(() => {
            db.ref("users/" + user.uid)
              .remove()
              .then(function() {
                console.log("USER REMOVE SUCCEEDED!!! ");
              })
              .catch(function(error) {
                console.log("USER REMOVE FAILED::: " + error.message);
                realThis.systemMessage = error.message;
              });
          })
          .then(() => {
            user
              .delete()
              .then(() => {
                realThis.systemMessage =
                  "Your account was deleted successfully.";
                realThis.$store.dispatch("REMOVE_USER");
                realThis.$router.push("/account/goodbye");
              })
              .catch(function(error) {
                realThis.systemMessage = error.message;
                console.log("ERROR DELETING USER::: " + error);
              });
          })
          .catch(function(error) {
            realThis.systemMessage = error.message;
            console.log("ERROR DURING DELETING PROCESS::: " + error);
          });
      }
    }
  }
};
</script>

