<template>
  <div class="container mobile-width padding-horizontal--large">
    <h2 class="heading--display-font margin-bottom--large">Your account details</h2>
    <div class="flex-row-container">
      <dl>
        <dt>Name: {{user && user.name ? user.name : null}}</dt>
        <dt>E-mail: {{user && user.email ? user.email : null}}</dt>
        <dt>Total amount of recipes: {{ recipes ? recipes.length : null}}</dt>
        <dt>
          <ol>
            <li v-for="recipe in recipes" :key="recipe[1].title">{{recipe[1].title}}</li>
          </ol>
        </dt>
      </dl>
      <button
        class="button button--small button--transparent button--transparent-red margin-top--large"
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
  name: "account",
  data() {
    return { systemMessage: "" };
  },
  components: {},
  mixins: [user],
  computed: {
    recipes() {
      return this.$store.getters.recipes;
    }
  },
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

