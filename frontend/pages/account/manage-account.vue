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
import { auth } from "~/plugins/firebase.js";
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
        user
          .delete()
          .then(function() {
            realThis.systemMessage = "Your account was deleted successfully.";
            realThis.$store.dispatch("REMOVE_USER");
            realThis.$router.push("/account/sucessful-delete");
          })
          .catch(function(error) {
            realThis.systemMessage = error;
            console.log("ERROR DELETING USER::: " + error);
          });
      }
    }
  }
};
</script>

