<template>
  <div class="account container mobile-width padding-horizontal--large">
    <h2 class="heading--display-font margin-bottom--large">My account details</h2>
    <div class="flex-row-container">
      <dl>
        <dt class="account__detail">
          <div class="account__detail-title">
            <span>
              Username
              <span class="system-message">(visible to other users)</span>
            </span>
            <button
              @click="toggleEditUsername"
              class="button button--small button--transparent"
            >{{editBtnText}}</button>
          </div>
          <span
            class="account__detail-value"
            v-if="!editUsername"
          >{{user && user.name ? user.name : null}}</span>
          <form class="account__detail-edit" v-else>
            <label>
              <input type="text" :value="user.name" />
            </label>
          </form>
        </dt>
        <dt class="account__detail">
          <div class="account__detail-title">
            <span>E-mail</span>
            <button
              @click="toggleEditEmail"
              class="button button--small button--transparent"
            >{{editBtnText}}</button>
          </div>

          <span
            class="account__detail-value"
            v-if="!editEmail"
          >{{user && user.email ? user.email : null}}</span>
          <form class="account__detail-edit" v-else>
            <label>
              <input type="email" :value="user.email" />
            </label>
          </form>
        </dt>
        <dt class="account__detail">
          <div class="account__detail-title">
            <span>
              Biography
              <span class="system-message">(visible to other users)</span>
            </span>
            <button
              @click="toggleEditBiography"
              class="button button--small button--transparent"
            >{{editBtnText}}</button>
          </div>
          <span
            class="account__detail-value"
            v-if="!editBiography"
          >{{user && user.biography ? user.biography : "Not set"}}</span>
          <form class="account__detail-edit" v-else>
            <label>
              <textarea type="text" :value="user.biography" />
            </label>
          </form>
        </dt>
        <dt class="account__detail">
          <div class="account__detail-title">
            <span>
              Total amount of recipes:
              <span>{{ recipes ? recipes.length : null}}</span>
            </span>
          </div>
          <ol>
            <li v-for="recipe in recipes" :key="recipe[1].title">
              <span>{{recipe[1].title}}</span>
              <span class="system-message" v-if="recipe[1].public">Public</span>
            </li>
          </ol>
        </dt>
        <dt class="account__detail">
          <div class="account__detail-title">
            <span>
              Total amount of recipes shared with me:
              <span>{{ sharedRecipes ? sharedRecipes.length : null}}</span>
            </span>
          </div>
          <ol>
            <li v-for="recipe in sharedRecipes" :key="recipe[1].title">{{recipe[1].title}}</li>
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
    return {
      systemMessage: "",
      username: "",
      email: "",
      biography: "",
      editUsername: false,
      editEmail: false,
      editBiography: false,
      editBtnText: "Edit"
    };
  },
  components: {},
  mixins: [user],
  computed: {
    recipes() {
      return this.$store.getters.recipes;
    },
    sharedRecipes() {
      return this.$store.getters.sharedRecipes;
    }
  },
  methods: {
    toggleEditUsername() {
      this.editUsername = !this.editUsername;
    },
    toggleEditEmail() {
      this.editEmail = !this.editEmail;
    },
    toggleEditBiography() {
      this.editBiography = !this.editBiography;
    },
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

