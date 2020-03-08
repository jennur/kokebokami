<template>
  <section :key="key">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="flex-column flex-align--end">
      <button
        @click="unfollowUser"
        class="button button--small button--red-border margin-top--large"
        v-if="isFollowingUser"
      >
        Unfollow {{ userVisited ? userVisited[1].displayName : "" }}
      </button>
      <button
        @click="followUser"
        class="button button--small button--green-border margin-top--large"
        v-else
      >
        Follow {{ userVisited ? userVisited[1].displayName : "" }}
      </button>
      <span class="system-message margin-top--medium">{{ systemMessage }}</span>
    </div>
    <profile-view
      class="margin-top--medium"
      :user="userVisited ? userVisited[1] : {}"
    />
    <h3>Check out my recipes</h3>
    <recipes-list :recipes="userVisitedsPublicRecipes" />
  </section>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
import { db } from "~/plugins/firebase.js";
import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/Recipes/RecipesList";

export default {
  name: "public-profile",
  components: { ProfileView, RecipesList },
  data() {
    return { systemMessage: "", key: 0, followed: null };
  },
  mixins: [user],
  computed: {
    cookUserID() {
      return this.$route.params.userid;
    },
    userVisited() {
      let users = this.$store.state.allUsers;
      if (users) {
        return users.find(user => {
          return user[0] === this.cookUserID;
        });
      }
    },
    breadcrumbs() {
      if (this.userVisited) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks" },
          { name: `${this.userVisited[1].displayName}` }
        ];
      }
    },
    userVisitedsPublicRecipes() {
      let publicRecipes = this.$store.state.publicRecipes;
      let userVisitedsPublicRecipes = [];
      if (this.userVisited) {
        userVisitedsPublicRecipes = publicRecipes.filter(recipe => {
          return recipe[1].ownerID === this.userVisited[0];
        });
      }
      return userVisitedsPublicRecipes;
    },
    isFollowingUser() {
      if (this.followed !== null) return this.followed;
      if (this.user && this.user.following) {
        return (
          Object.values(this.user.following).indexOf(this.userVisited[0]) > -1
        );
      }
    }
  },
  methods: {
    followUser() {
      const realThis = this;
      const currentUserRef = db.ref("users/" + this.user.id + "/following");
      currentUserRef
        .once("value", async snapshot => {
          let followingAlready = false;

          if (await snapshot.exists()) {
            await snapshot.forEach(value => {
              if (value.val() === realThis.userVisited[0]) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              realThis.systemMessage =
                "You're already following " +
                realThis.userVisited[1].displayName;
            }
          }
          if (!followingAlready) {
            currentUserRef
              .push(realThis.userVisited[0])
              .then(() => {
                realThis.followed = true;
              })
              .catch(error => {
                console.log(error);
                realThis.systemMessage = error.message;
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    unfollowUser() {
      const realThis = this;

      const userRef = db.ref("users/" + this.user.id + "/following");
      userRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === realThis.userVisited[0]) {
                userRef
                  .child(value.key)
                  .remove()
                  .then(() => {
                    realThis.followed = false;
                  })
                  .catch(error => console.log(error));
                return;
              }
            });
          } else {
            console.log("Error: Snapshot does not exist in unfollowUser()");
          }
        })
        .catch(error => {
          console.log("Error: Something went wrong in userRef()::", error);
        });
    }
  }
};
</script>
