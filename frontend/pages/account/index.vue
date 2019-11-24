<template>
  <div>
    <div class="tablet-width margin--auto padding-horizontal--large">
      <breadcrumbs :routes="breadcrumbs" />
    </div>
    <div class="account container tablet-width padding-horizontal--large">
      <h1 class="heading--display-font margin-top--xxlarge margin-bottom--large">My account details</h1>
      <nuxt-link to="/account/public-profile-view">
        See my public profile
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
            <div class="system-message">{{profileImgSystemMessage}}</div>
            <button
              @click="toggleEditProfileImg"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{editProfileImg ? "Cancel" : "Edit"}}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>
                Username
                <span class="system-message">(visible to other users)</span>
              </span>
            </div>
            <span class="account__detail-value" v-if="!editUsername">{{username ? username : null}}</span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <input type="text" autocomplete="username" v-model="username" />
              </label>
              <button @click="updateUsername" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{usernameSystemMessage}}</div>
            <button
              @click="toggleEditUsername"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{editUsername ? "Cancel" : "Edit"}}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>E-mail</span>
            </div>
            <span class="account__detail-value" v-if="!editEmail">{{email ? email : null}}</span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <input type="email" autocomplete="email" v-model="email" />
              </label>
              <button @click="updateEmail" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{emailSystemMessage}}</div>
            <button
              @click="toggleEditEmail"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{editEmail ? "Cancel" : "Edit"}}</button>
          </dt>

          <dt class="account__detail account__detail--flex-column">
            <div class="account__detail-title">
              <span>
                Biography
                <span class="system-message">(visible to other users)</span>
              </span>
            </div>
            <span
              class="account__detail-value"
              v-if="!editBiography"
            >{{biography ? biography : "Not set"}}</span>
            <form v-on:submit.prevent class="account__detail-edit" v-else>
              <label>
                <textarea type="text" v-model="biography" />
              </label>
              <button @click="updateBiography" class="button button--small">Save</button>
            </form>
            <div class="system-message">{{biographySystemMessage}}</div>
            <button
              @click="toggleEditBiography"
              class="button button--small button--transparent account__detail-edit-btn"
            >{{editBiography ? "Cancel" : "Edit"}}</button>
          </dt>
        </dl>
        <h3>Recipes connected to your account</h3>
        <dl class="flex-row">
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                My recipes:
                <span>{{ recipes ? recipes.length : null}}</span>
              </span>
            </div>
            <ol>
              <li v-for="recipe in recipes" :key="recipe[1].title">
                <span>
                  <nuxt-link :to="'recipes/' + recipe[0]">{{recipe[1].title}}</nuxt-link>
                </span>
                <span class="system-message" v-if="recipe[1].public">Public</span>
              </li>
            </ol>
          </dt>
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                Recipes shared with me:
                <span>{{ sharedRecipes ? sharedRecipes.length : null}}</span>
              </span>
            </div>
            <ol>
              <li v-for="recipe in sharedRecipes" :key="recipe[1].title">
                <nuxt-link :to="'recipes/' + recipe[0]">{{recipe[1].title}}</nuxt-link>
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
                <span>{{ cooksImFollowing ? cooksImFollowing.length : null}}</span>
              </span>
            </div>
            <ol>
              <li v-for="cook in cooksImFollowing" :key="cook[1].displayName">
                <nuxt-link :to="'cooks/' + cook[0]">{{cook[1].displayName}}</nuxt-link>
              </li>
            </ol>
          </dt>
          <dt class="account__detail">
            <div class="account__detail-title">
              <span>
                Followers:
                <span>{{ cooksFollowingMe ? cooksFollowingMe.length : null}}</span>
              </span>
            </div>
            <ol>
              <li v-for="cook in cooksFollowingMe" :key="cook[1].displayName">
                <nuxt-link :to="'cooks/' + cook[0]">{{cook[1].displayName}}</nuxt-link>
              </li>
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
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "My account" }]
    }
  },
  components: {},
  mounted() {
    this.username = this.user.displayName;
    this.email = this.user.email;
    this.biography = this.user.biography;
    this.photoURL = this.user.photoURL;
  },
  mixins: [user],
  computed: {
    recipes() {
      return this.$store.getters.recipes;
    },
    sharedRecipes() {
      return this.$store.getters.sharedRecipes;
    },
    cooksImFollowing() {
      let users = this.$store.getters.allUsers;
      let followingUserData = [];
      let following =
        this.user && this.user.following
          ? Object.entries(this.user.following)
          : [];
      if (users && following.length) {
        users.forEach(user => {
          following.forEach(follower => {
            if (user[0] === follower[1]) {
              followingUserData.push(user);
            }
          });
        });
      }
      return followingUserData;
    },
    cooksFollowingMe() {
      let users = this.$store.getters.allUsers;
      let followerUserData = [];
      let followers =
        this.user && this.user.followers
          ? Object.entries(this.user.followers)
          : [];
      if (followers.length) {
        users.forEach(user => {
          followers.forEach(follower => {
            if (user[0] === follower[1]) {
              followerUserData.push(user);
            }
          });
        });
      }
      return followerUserData;
    }
  },
  methods: {
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
      let realThis = this;
      db.ref("/users/" + this.user.id)
        .update({
          photoURL: ""
        })
        .then(() => {
          realThis.updateUserDetailsInStore();
          realThis.toggleEditProfileImg();
        })
        .catch(e => {
          this.profileImgSystemMessage = e.message;
          console.log(e);
        });
    },
    updateUsername() {
      let realThis = this;
      db.ref("/users/" + this.user.id)
        .update({
          displayName: this.username
        })
        .then(() => {
          realThis.updateUserDetailsInStore();
          realThis.toggleEditUsername();
        })
        .catch(e => {
          this.usernameSystemMessage = e.message;
          console.log(e);
        });
    },
    updateEmail() {
      let realThis = this;
      db.ref("/users/" + this.user.id)
        .update({
          email: this.email
        })
        .then(() => {
          realThis.updateUserDetailsInStore();
          realThis.toggleEditEmail();
        })
        .catch(e => {
          this.emailSystemMessage = e.message;
          console.log(e);
        });
    },

    updateBiography() {
      let realThis = this;
      db.ref("/users/" + this.user.id)
        .update({
          biography: this.biography
        })
        .then(() => {
          realThis.updateUserDetailsInStore();
          realThis.toggleEditBiography();
        })
        .catch(e => {
          this.biographySystemMessage = e.message;
          console.log(e);
        });
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
                    console.log("ERROR DELETING RECIPE::: " + error);
                  });
            });
          })
          .then(() => {
            db.ref("users/" + user.uid)
              .remove()
              .then(function() {
                console.log("USER REMOVE SUCCEEDED");
              })
              .catch(function(error) {
                console.log("USER REMOVE FAILED::: " + error);
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

