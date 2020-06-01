<template>
  <section :key="key">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="flex-column flex-align--end">
      <button
        @click="unfollowUser"
        class="button button--small button--red-border margin-top--large"
        v-if="isFollowingUser"
      >Unfollow {{ userVisited ? userVisited[1].displayName : "" }}</button>
      <button
        @click="followUser"
        class="button button--small button--green-border margin-top--large"
        v-else
      >Follow {{ userVisited ? userVisited[1].displayName : "" }}</button>
      <span class="system-message margin-top--medium">{{ systemMessage }}</span>
    </div>
    <profile-view class="margin-top--medium" :user="userVisited ? userVisited[1] : {}" />
    <h3>Check out my recipes</h3>
    <recipes-list
      :recipes="userVisitedsPublicRecipes"
      :emptyListMessage="`${userName} did not add any public recipes yet 🤷🏾‍♂️`"
    />
  </section>
</template>
<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/Recipes/RecipesList";

export default {
  name: "public-profile",
  components: { ProfileView, RecipesList },
  data() {
    return { systemMessage: "", key: 0, followed: null };
  },
  mixins: [user, allUsers, publicRecipes],
  computed: {
    cookUserID() {
      return this.$route.params.userid;
    },
    userVisited() {
      let users = this.allUsers;
      return users.find(user => {
        return user[0] === this.cookUserID;
      });

      return null;
    },
    userName() {
      return (
        (this.userVisited && this.userVisited[1].displayName) || "This user"
      );
    },
    breadcrumbs() {
      if (this.userVisited) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks/" },
          { name: `${this.userVisited[1].displayName}` }
        ];
      }
    },
    userVisitedsPublicRecipes() {
      let publicRecipes = this.publicRecipes;
      let userVisitedsPublicRecipes = [];
      if (this.userVisited && publicRecipes) {
        userVisitedsPublicRecipes = publicRecipes.filter(recipe => {
          return recipe[1].ownerID === this.userVisited[0];
        });
      }
      return userVisitedsPublicRecipes;
    },
    isFollowingUser() {
      if (this.followed !== null) return this.followed;
      else {
        if (this.user && this.user.following && this.userVisited) {
          return (
            Object.values(this.user.following).indexOf(this.userVisited[0]) > -1
          );
        }
      }
    }
  },
  methods: {
    followUser() {
      let componentThis = this;
      try {
        let currentUserRef = this.$fireDb.ref(
          "users/" + this.user.id + "/following"
        );
        currentUserRef.once("value", async snapshot => {
          let followingAlready = false;
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === componentThis.userVisited[0]) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              componentThis.systemMessage =
                "You're already following " +
                componentThis.userVisited[1].displayName;
            }
          }
          if (!followingAlready) {
            currentUserRef
              .push(componentThis.userVisited[0])
              .then(() => {
                componentThis.followed = true;
                componentThis.$store.dispatch("SET_USER");
              })
              .catch(error => {
                console.log(error);
                componentThis.systemMessage = error.message;
              });
          }
        });
      } catch (error) {
        console.log("Error while trying to follow user:", error);
      }
    },
    unfollowUser() {
      let componentThis = this;
      try {
        let userRef = this.$fireDb.ref("users/" + this.user.id + "/following");
        userRef.once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === componentThis.userVisited[0]) {
                try {
                  userRef
                    .child(value.key)
                    .remove()
                    .then(() => {
                      componentThis.followed = false;
                      componentThis.$store.dispatch("SET_USER");
                    });
                } catch (errorr) {
                  console.log(error);
                }
                return;
              }
            });
          }
        });
      } catch (error) {
        console.log("Error while trying to unfollow user:", error);
      }
    }
  }
};
</script>
