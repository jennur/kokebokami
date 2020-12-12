<template>
  <section>
    <div v-if="!loadedProfile" class="flex-center-container">
      <span class="simple-loading-spinner" />
    </div>
    <div v-if="loadedProfile && cook">
      <breadcrumbs :routes="breadcrumbs" />
      <div v-if="user && user.id" class="flex-column flex-align--end">
        <button
          @click="unfollowUser"
          class="button button--small button--red-border margin-top--large"
          v-if="isFollowingUser"
        >
          {{ $t("cooks.unfollow") }} {{ cook ? cook.displayName : "" }}
        </button>
        <button
          @click="followUser"
          class="button button--small button--green-border margin-top--large"
          v-else
        >
          {{ $t("cooks.follow") }} {{ cook ? cook.displayName : "" }}
        </button>
        <span class="system-message margin-top--medium">{{
          systemMessage
        }}</span>
      </div>

      <profile-view class="margin-top--medium" :user="cook" />
      <h3>{{ $t("cooks.checkOutMyRecipes") }}</h3>
      <recipes-list
        :recipes="cooksPublicRecipes"
        :emptyListMessage="
          `${userName} ${$t('cooks.didNotAddAnyPublicRecipes')}`
        "
      />
    </div>
    <div
      v-if="loadedProfile && !cook"
      class="container container--center margin--auto margin-bottom--xlarge"
    >
      <cookSilhouette class="illustration--cook-bubble" />
      <h3>
        Hmmm...
      </h3>
      <p>
        The profile you're trying to access seems to be hidden or not existing
      </p>
      <nuxt-link v-if="user && user.id" to="/cooks/"
        >Discover other cooks ➔</nuxt-link
      >
      <nuxt-link v-else to="/login/">Log in to discover cooks ➔</nuxt-link>
    </div>
  </section>
</template>
<script>
import cookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import user from "~/mixins/user.js";
import getUserByID from "~/mixins/get-user-by-id.js";
import publicRecipes from "~/mixins/public-recipes.js";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/Recipes/RecipesList";

import generatePath from "~/helpers/generatePath";

export default {
  name: "public-profile",
  components: { cookSilhouette, ProfileView, RecipesList },
  head() {
    let displayName = this.cook && this.cook.displayName;
    let path = displayName && generatePath(displayName) || "";
    return {
      title: `${this.userName} | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: `https://kokebokami.com/cooks/${path}/`
        }
      ]
    };
  },
  data() {
    return { systemMessage: "", followed: null };
  },
  mixins: [user, getUserByID, publicRecipes],
  computed: {
    userName() {
      return (this.cook && this.cook.displayName) || "Unknown";
    },
    breadcrumbs() {
      if (this.cook) {
        return [
          { name: this.$t("navigation.home"), link: "/" },
          { name: this.$t("navigation.cooks"), link: "/cooks/" },
          { name: `${this.cook.displayName}` }
        ];
      }
    },
    cooksPublicRecipes() {
      let publicRecipes = this.publicRecipes;
      let cooksPublicRecipes = [];
      if (this.cook && publicRecipes) {
        cooksPublicRecipes = publicRecipes.filter(recipe => {
          return recipe.ownerID === this.cook.id;
        });
      }
      return cooksPublicRecipes;
    },
    isFollowingUser() {
      if (this.followed !== null) return this.followed;
      else {
        if (this.user && this.user.following && this.cook.id) {
          return (
            Object.values(this.user.following).indexOf(this.cook.id) > -1
          );
        }
      }
    }
  },
  methods: {
    followUser() {
      let componentThis = this;
      try {
        let currentUserRef = this.$fire.database.ref(
          `users/${this.user.id}/following`
        );
        currentUserRef.once("value", async snapshot => {
          let followingAlready = false;
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === componentThis.cook.id) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              componentThis.systemMessage =
                "You're already following " + componentThis.cook.displayName;
            }
          }
          if (!followingAlready) {
            currentUserRef
              .push(componentThis.cook.id)
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
        console.log("Error while trying to follow user:", error.message);
      }
    },
    unfollowUser() {
      let componentThis = this;
      try {
        let userRef = this.$fire.database.ref(`users/${this.user.id}/following`);
        userRef.once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === componentThis.cook.id) {
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
    getUserID(){
      this.$fire.database
        .ref("users")
        .once("value", snapshot => {
          if(snapshot.exists() && snapshot.val()){
            let users = snapshot.val();

            for(let key in users){
              let user = users[key];
              let path = generatePath(user.displayName);
              if(path === this.$route.params.userid){
                this.getUserByID(key)
                return;
              }
            }
          }
      })
    }
  },
  mounted() {
    let userID = this.$route.query.id;
    userID && this.getUserByID(userID) || this.getUserID();
  }
};
</script>
