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
          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>
                Profile picture
                <span class="system-message">(visible to other users)</span>
              </span>
            </div>
            <img
              class="profile__img margin-top--large"
              :src="photoURL"
              :alt="user.displayName + '´s profile picture'"
              v-if="photoURL"
            />
            <form v-on:submit.prevent class="account__detail-edit" v-if="editProfileImg">
              <button
                @click="updateProfileImg"
                class="button button--small margin-top--large"
              >Remove</button>
            </form>
            <div class="system-message">{{ profileImgSystemMessage }}</div>
            <button
              @click="toggleEditProfileImg"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{ editProfileImg ? "Cancel" : "Edit" }}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>
                Username
                <span class="system-message">(visible to other users)</span>
              </span>
            </div>
            <span class="account__detail-value" v-if="!editUsername">
              {{
              username ? username : null
              }}
            </span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <input type="text" autocomplete="username" v-model="username" />
              </label>
              <button @click="updateUsername" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{ usernameSystemMessage }}</div>
            <button
              @click="toggleEditUsername"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{ editUsername ? "Cancel" : "Edit" }}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>E-mail</span>
            </div>
            <span class="account__detail-value" v-if="!editEmail">
              {{
              email ? email : null
              }}
            </span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <input type="email" autocomplete="email" v-model="email" />
              </label>
              <button @click="updateEmail" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{ emailSystemMessage }}</div>
            <button
              @click="toggleEditEmail"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{ editEmail ? "Cancel" : "Edit" }}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>
                Biography
                <span class="system-message">(visible to other users)</span>
              </span>
            </div>
            <span class="account__detail-value" v-if="!editBiography">
              {{
              biography ? biography : "Not set"
              }}
            </span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <textarea type="text" v-model="biography" />
              </label>
              <button @click="updateBiography" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{ biographySystemMessage }}</div>
            <button
              @click="toggleEditBiography"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{ editBiography ? "Cancel" : "Edit" }}</button>
          </dt>
        </dl>
        <h3>Recipes connected to your account</h3>
        <dl class="flex-row">
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                My recipes:
                <span>{{ userRecipes ? userRecipes.length : null }}</span>
              </span>
            </div>
            <ol>
              <li v-for="recipe in userRecipes" :key="recipe[1].title">
                <span>
                  <nuxt-link :to="`/recipes/${recipe[0]}`">
                    {{
                    recipe[1].title
                    }}
                  </nuxt-link>
                </span>
                <span class="system-message" v-if="recipe[1].public">Public</span>
              </li>
            </ol>
          </dt>
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                Recipes shared with me:
                <span>{{ sharedRecipes ? sharedRecipes.length : null }}</span>
              </span>
            </div>
            <ol>
              <li v-for="recipe in sharedRecipes" :key="recipe[1].title">
                <nuxt-link :to="`/recipes/${recipe[0]}`">
                  {{
                  recipe[1].title
                  }}
                </nuxt-link>
              </li>
            </ol>
          </dt>
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                My recipe links:
                <span>{{ userRecipeLinks ? userRecipeLinks.length : null }}</span>
              </span>
            </div>
            <ol>
              <li v-for="link in userRecipeLinks" :key="link[0]">
                <a :href="link[1] && link[1].url" target="_blank">
                  {{
                  link[1].title || backupTitle(link[1])
                  }}
                </a>
                <new-tab-icon class="account__recipe-link-icon" />
              </li>
            </ol>
          </dt>
        </dl>

        <h3>Cooks connected to your account</h3>
        <dl class="flex-row">
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                Following:
                <span>{{ followed ? followed.length : null }}</span>
              </span>
            </div>
            <ol>
              <li v-for="cook in followed" :key="cook[1].displayName">
                <nuxt-link :to="`/cooks/${cook[0]}`">
                  {{
                  cook[1].displayName
                  }}
                </nuxt-link>
              </li>
            </ol>
          </dt>
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                Followers:
                <span>{{ followers ? followers.length : null }}</span>
              </span>
            </div>
            <ol>
              <li v-for="follower in followers" :key="follower[1].displayName">
                <nuxt-link :to="`/cooks/${follower[0]}`">
                  {{
                  follower[1].displayName
                  }}
                </nuxt-link>
              </li>
            </ol>
          </dt>
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

import newTabIcon from "~/assets/graphics/new-tab-icon.svg";

export default {
  name: "account",
  components: {
    newTabIcon
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
      profileImgSystemMessage: "",
      usernameSystemMessage: "",
      emailSystemMessage: "",
      biographySystemMessage: "",
      photoURL: "",
      username: "",
      email: "",
      biography: "",
      editProfileImg: false,
      editUsername: false,
      editEmail: false,
      editBiography: false
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
  methods: {
    backupTitle(link) {
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
    toggleEditProfileImg() {
      this.editProfileImg = !this.editProfileImg;
    },
    toggleEditUsername() {
      this.editUsername = !this.editUsername;
    },
    toggleEditEmail() {
      this.editEmail = !this.editEmail;
    },
    toggleEditBiography() {
      this.editBiography = !this.editBiography;
    },
    updateProfileImg() {
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
          this.profileImgSystemMessage = e.message;
          console.log(e);
        });
    },
    updateUsername() {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          displayName: this.username
        })
        .then(() => {
          componentThis.updateUserDetailsInStore();
          componentThis.toggleEditUsername();
        })
        .catch(e => {
          this.usernameSystemMessage = e.message;
          console.log(e);
        });
    },
    updateEmail() {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          email: this.email
        })
        .then(() => {
          componentThis.updateUserDetailsInStore();
          componentThis.toggleEditEmail();
        })
        .catch(e => {
          this.emailSystemMessage = e.message;
          console.log(e);
        });
    },

    updateBiography() {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          biography: this.biography
        })
        .then(() => {
          componentThis.updateUserDetailsInStore();
          componentThis.toggleEditBiography();
        })
        .catch(e => {
          this.biographySystemMessage = e.message;
          console.log(e);
        });
    },
    deleteAccount() {
      let user = this.$fireAuth.currentUser;
      let userUID = this.user.id;
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
                    console.log("Error: Recipe removal failed:", error);
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
                console.log("Error: User remove failed:", error);
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
                console.log("Error: User delete failed:", error);
              });
          })
          .catch(function(error) {
            componentThis.systemMessage = error.message;
            console.log("Error: Recipes reference failed:", error);
          });
      }
    }
  },
  mounted() {
    this.username = this.user.displayName;
    this.email = this.user.email;
    this.biography = this.user.biography;
    this.photoURL = this.user.photoURL;
  }
};
</script>
