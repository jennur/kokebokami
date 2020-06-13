<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="account container tablet-width padding-horizontal--large">
      <h1 class="margin-top--xxlarge margin-bottom--large">My account details</h1>
      <nuxt-link to="/account/public-profile-view/">
        See your public profile
        <right-arrow class="icon icon--blue" />
      </nuxt-link>
      <div>
        <h3 class="margin-top--xxlarge">Personal data</h3>
        <dl class="flex-row">
          <account-detail
            title="Profile image"
            :systemMessage="systemMessage"
            :visibleToPublic="true"
            :editOption="true"
            :removeOption="true"
            @update="(value) => updateProfileImg(value)"
            @remove="removeProfileImg"
            :currentValue="photoURL"
            :isImage="true"
          />

          <account-detail
            title="Username"
            :systemMessage="systemMessage"
            :visibleToPublic="true"
            :editOption="true"
            autocompleteType="username"
            @update="(value) => updateUsername(value)"
            :currentValue="username && username.length ? username : 'User'"
          />

          <account-detail
            :systemMessage="systemMessage"
            :visibleToPublic="false"
            :editOption="true"
            title="E-mail"
            inputType="email"
            autocompleteType="email"
            @update="(value) => updateEmail(value)"
            :currentValue="email"
          />

          <account-detail
            title="Biography"
            :systemMessage="systemMessage"
            :visibleToPublic="true"
            :editOption="true"
            inputType="textarea"
            @update="(value) => updateBiography(value)"
            :currentValue="biography"
          />
        </dl>

        <h3>Recipes connected to your account</h3>
        <dl class="flex-row">
          <account-link-list title="My recipes:" :links="userRecipes" basePath="/recipes/" />
          <account-link-list
            title="Recipes shared with me:"
            :links="sharedRecipes"
            basePath="/recipes/"
          />
          <account-link-list title="My recipe links:" :links="recipeLinks" :externalURL="true" />
        </dl>

        <h3>Cooks connected to your account</h3>
        <dl class="flex-row">
          <account-link-list title="Following:" :links="cooksFollowed" basePath="/cooks/" />
          <account-link-list title="Followers:" :links="cookFollowers" basePath="/cooks/" />
        </dl>
        <button
          class="button button--small button--transparent button--transparent-red margin-top--large"
          @click="deleteAccount"
        >Delete my account</button>
        <p class="system-message">{{ systemMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import connectedUsers from "~/mixins/connectedUsers.js";
import sharedRecipes from "~/mixins/sharedRecipes.js";
import userRecipes from "~/mixins/userRecipes.js";
import userRecipeLinks from "~/mixins/userRecipeLinks.js";

import AccountDetail from "~/components/Account/Displays/AccountDetail.vue";
import AccountLinkList from "~/components/Account/Displays/AccountLinkList.vue";

export default {
  name: "account",
  components: {
    AccountDetail,
    AccountLinkList
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "My account" }]
    }
  },
  data() {
    return {
      systemMessage: "",
      photoURL: "",
      username: "",
      email: "",
      biography: ""
    };
  },
  mixins: [
    user,
    allUsers,
    connectedUsers,
    userRecipes,
    sharedRecipes,
    userRecipeLinks
  ],
  computed: {
    recipeLinks() {
      let links = this.userRecipeLinks;
      links = links.map(link => {
        link[1].title = link[1].title || this.makeBackupTitle(link[1]);
        return link;
      });
      return links;
    },
    cooksFollowed() {
      let followed = this.followed;
      return followed.map(cook => {
        cook[1].title = cook[1].displayName;
        return cook;
      });
    },
    cookFollowers() {
      let followers = this.followers;
      return followers.map(cook => {
        cook[1].title = cook[1].displayName;
        return cook;
      });
    }
  },
  methods: {
    makeBackupTitle(link) {
      let regex = /-/gi;
      let url = link.url;
      let title = url
        .split("/")
        .pop()
        .replace(regex, " ");
      return title;
    },
    updateUserDetailsInStore() {
      let userObj = {
        id: this.user.id,
        photoURL: this.photoURL,
        displayName: this.username,
        email: this.email,
        biography: this.biography
      };
      this.$store.dispatch("SET_USER", userObj);
    },
    updateProfileImg() {},
    removeProfileImg() {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          photoURL: ""
        })
        .then(() => {
          componentThis.updateUserDetailsInStore();
          componentThis.toggleEditProfileImg();
        })
        .catch(e => {
          this.systemMessage = e.message;
          console.log(e);
        });
    },
    updateUsername(value) {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          displayName: value
        })
        .then(() => {
          componentThis.username = value;
          componentThis.updateUserDetailsInStore();
        })
        .catch(e => {
          this.systemMessage = e.message;
          console.log(e);
        });
    },
    updateEmail(value) {
      //Fix this with firebase
      let componentThis = this;
      /* this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          email: value
        })
        .then(() => {
          componentThis.email = value;
          componentThis.updateUserDetailsInStore();
        })
        .catch(e => {
          this.emailSystemMessage = e.message;
          console.log(e);
        }); */
    },

    updateBiography(value) {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          biography: value
        })
        .then(() => {
          componentThis.biography = value;
          componentThis.updateUserDetailsInStore();
        })
        .catch(e => {
          this.systemMessage = e.message;
          console.log(e);
        });
    },
    deleteAccount() {
      let user = this.$fireAuth.currentUser;
      const componentThis = this;
      if (
        confirm(
          `Are you sure you want to delete your account and all your recipes?
          \nThis operation cannot be undone.`
        )
      ) {
        let recipesRef = this.$fireDb.ref("recipes").orderByChild("ownerID");

        //Remove user's recipes
        recipesRef
          .once("value", recipes => {
            recipes.forEach(recipe => {
              if (recipe.val().ownerID === user.uid) {
                this.$fireDb
                  .ref("recipes/" + recipe.key)
                  .remove()
                  .then(() => {
                    console.log("Success: Deleted recipe:", recipe.key);
                  })
                  .catch(error => {
                    console.log("Error: Recipe removal failed:", error.message);
                  });
              }
            });
          })
          .then(() => {
            this.$fireDb
              .ref("users/" + user.uid)
              .remove()
              .then(function() {
                console.log("Success: User was removed from database");
              })
              .catch(function(error) {
                console.log("Error: User remove failed:", error.message);
                componentThis.systemMessage = error.message;
              });
          })
          .then(() => {
            user
              .delete()
              .then(() => {
                componentThis.systemMessage =
                  "Your account was deleted successfully.";
                componentThis.$store.dispatch("REMOVE_USER");
                componentThis.$router.push("/account/goodbye/");
              })
              .catch(function(error) {
                componentThis.systemMessage = error.message;
                console.log("Error: User delete failed:", error.message);
              });
          })
          .catch(function(error) {
            componentThis.systemMessage = error.message;
            console.log("Error: Recipes reference failed:", error.message);
          });
      }
    }
  },
  created() {
    this.username = this.user.displayName;
    this.email = this.user.email;
    this.biography = this.user.biography;
    this.photoURL = this.user.photoURL;
  }
};
</script>
