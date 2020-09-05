<template>
  <section :key="key">
    <breadcrumbs :routes="breadcrumbs" />
    <div v-if="user && user.id" class="flex-column flex-align--end">
      <button
        @click="unfollowUser"
        class="button button--small button--red-border margin-top--large"
        v-if="isFollowingUser"
      >Unfollow {{ cookVisited ? cookVisited.displayName : "" }}</button>
      <button
        @click="followUser"
        class="button button--small button--green-border margin-top--large"
        v-else
      >Follow {{ cookVisited ? cookVisited.displayName : "" }}</button>
      <span class="system-message margin-top--medium">{{ systemMessage }}</span>
    </div>
    <profile-view class="margin-top--medium" :user="cookVisited" />
    <h3>Check out my recipes</h3>
    <recipes-list
      :recipes="cookVisitedsPublicRecipes"
      :emptyListMessage="`${userName} did not add any public recipes yet 🤷🏾‍♂️`"
    />
  </section>
</template>
<script>
import user from "~/mixins/user.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/Recipes/RecipesList";

export default {
  name: "public-profile",
  components: { ProfileView, RecipesList },
  head() {
    return {
      title: `${this.userName} | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com" + this.cookUserID,
        },
      ],
    };
  },
  data() {
    return { systemMessage: "", key: 0, followed: null, cookVisited: null };
  },
  mixins: [user, publicRecipes],
  computed: {
    cookUserID() {
      return this.$route.params.userid;
    },
    userName() {
      return (this.cookVisited && this.cookVisited.displayName) || "This user";
    },
    breadcrumbs() {
      if (this.cookVisited) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks/" },
          { name: `${this.cookVisited.displayName}` },
        ];
      }
    },
    cookVisitedsPublicRecipes() {
      let publicRecipes = this.publicRecipes;
      let cookVisitedsPublicRecipes = [];
      if (this.cookVisited && publicRecipes) {
        cookVisitedsPublicRecipes = publicRecipes.filter((recipe) => {
          return recipe[1].ownerID === this.cookUserID;
        });
      }
      return cookVisitedsPublicRecipes;
    },
    isFollowingUser() {
      if (this.followed !== null) return this.followed;
      else {
        if (this.user && this.user.following && this.cookUserID) {
          return (
            Object.values(this.user.following).indexOf(this.cookUserID) > -1
          );
        }
      }
    },
  },
  methods: {
    getCookVisited() {
      let cookRef = this.$fireDb.ref(`users/${this.cookUserID}`);
      cookRef
        .once("value", (cook) => {
          if (cook.exists()) cook = cook.val();
          if (cook.hiddenProfile) this.cookVisited = null;
          else
            this.cookVisited = {
              displayName: cook.displayName,
              biography: cook.biography,
              photoURL: cook.photoURL,
            };
        })
        .catch((error) => console.log("Error getting cook:", error));
    },
    followUser() {
      let componentThis = this;
      try {
        let currentUserRef = this.$fireDb.ref(
          `users/${this.user.id}/following`
        );
        currentUserRef.once("value", async (snapshot) => {
          let followingAlready = false;
          if (snapshot.exists()) {
            snapshot.forEach((value) => {
              if (value.val() === componentThis.cookUserID) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              componentThis.systemMessage =
                "You're already following " +
                componentThis.cookVisited.displayName;
            }
          }
          if (!followingAlready) {
            currentUserRef
              .push(componentThis.cookUserID)
              .then(() => {
                componentThis.followed = true;
                componentThis.$store.dispatch("SET_USER");
              })
              .catch((error) => {
                console.log(error);
                componentThis.systemMessage = error.message;
              });
          }
        });
      } catch (error) {
        console.log("Error while trying to follow user:", error.message);
      }
    },
    unfollowUser() {
      let componentThis = this;
      try {
        let userRef = this.$fireDb.ref(`users/${this.user.id}/following`);
        userRef.once("value", (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((value) => {
              if (value.val() === componentThis.cookUserID) {
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
        console.log("Error while trying to unfollow user:", error.message);
      }
    },
  },
  mounted() {
    this.getCookVisited();
  },
};
</script>
