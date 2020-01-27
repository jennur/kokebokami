<template>
  <section :key="key">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="flex-column">
      <button
        @click="unfollowUser"
        class="button button--small button--red-border"
        v-if="isFollowingUser"
      >Unfollow {{userVisited ? userVisited[1].displayName : ""}}</button>
      <button
        @click="followUser"
        class="button button--small button--green-border margin-top--large"
        v-else
      >Follow {{userVisited ? userVisited[1].displayName : ""}}</button>
      <span class="system-message margin-top--medium">{{systemMessage}}</span>
    </div>
    <profile-view class="margin-top--medium" :user="userVisited ? userVisited[1] : {}" />
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
      let users = this.$store.getters.allUsers;
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
      let publicRecipes = this.$store.getters.publicRecipes;
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
      const userVisitedRef = db.ref(
        "users/" + this.userVisited[0] + "/followers"
      );

      userVisitedRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            let followingAlready = false;

            snapshot.forEach(value => {
              if (value.val() === realThis.user.id) {
                followingAlready = true;
                return;
              }
            });

            if (!followingAlready) {
              userVisitedRef.push(this.user.id).catch(error => {
                console.log(error);
              });
            }
          } else {
            userVisitedRef.push(this.user.id).catch(error => {
              console.log(error);
            });
          }
        })
        .catch(error => {
          console.log(error);
        });

      const currentUserRef = db.ref("users/" + this.user.id + "/following");
      currentUserRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            let followingAlready = false;
            snapshot.forEach(value => {
              if (value.val() === realThis.userVisited[0]) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              realThis.systemMessage =
                "You're already following " +
                realThis.userVisited[1].displayName;
            } else {
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
          } else {
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
      const userVisitedRef = db.ref(
        "users/" + this.userVisited[0] + "/followers"
      );

      userVisitedRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === realThis.user.id) {
                userVisitedRef
                  .child(value.key)
                  .remove()
                  .catch(error => console.log(error));
                return;
              }
            });
          } else {
            console.log(
              "ERROR: Snapshot does not exist in unfollowUser userVisitedRef"
            );
          }
        })
        .catch(error => {
          console.log(error);
        });

      const currentUserRef = db.ref("users/" + this.user.id + "/following");
      currentUserRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === realThis.userVisited[0]) {
                currentUserRef
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
            console.log(
              "ERROR: Snapshot does not exist in unfollowUser currentUserRef"
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
