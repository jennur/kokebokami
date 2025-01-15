<template>
  <section>
    <div v-if="!loadedProfile" class="flex-center-container">
      <span class="simple-loading-spinner" />
    </div>

    <div v-if="loadedProfile">
      <div v-if="user && user.id && cook && !cook.hidden">

        <BreadCrumbs :routes="breadcrumbs" />

        <div class="flex-column flex-align--end">
          <button v-if="isFollowingUser" @click="unfollowUser" class="button button-sm button--red-border margin-top-lg">
            {{ $t("cooks.unfollow") }} {{ cook ? cook.displayName : "" }}
          </button>

          <button v-else @click="followUser" class="button button-sm button--green-border margin-top-lg">
            {{ $t("cooks.follow") }} {{ cook ? cook.displayName : "" }}
          </button>

          <span class="system-message margin-top-md">
            {{ systemMessage }}
          </span>
        </div>

        <profile-view class="margin-top-md" :user="cook" />

        <h3>{{ $t("cooks.checkOutMyRecipes") }}</h3>
        <recipes-list :recipes="cooksPublicRecipes" :emptyListMessage="`${userName} ${$t('cooks.didNotAddAnyPublicRecipes')}`"/>

      </div>

      <cook-hidden v-else :hidden="cook && cook.hidden" @update="getUser"/>
    </div>
  </section>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import { useCurrentUser } from 'vuefire'

import user from "~/composables/user.js";
import getPublicRecipes from "~/composables/publicRecipes.js";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/RecipePreview/RecipesList";
import CookHidden from "~/components/Cooks/CookHidden.vue";

import generatePath from "~/helpers/generatePath";
import userModel from "~/helpers/user-model";

export default {
  name: "public-profile",
  components: {
    ProfileView,
    RecipesList,
    CookHidden
  },
  head() {
    let displayName = this.cook && this.cook.displayName;
    let path = displayName && generatePath(displayName, this.cook.id) || "";
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
    return {
      systemMessage: "",
      cook: {},
      followed: null,
      loadedProfile: false,
      publicRecipes: [],
      errorMessage: "",
      loadedRecipes: false
    };
  },
  async asyncData({app}) {
    let recipes = await getPublicRecipes(app);
    return {
      publicRecipes: recipes.publicRecipes
    }
  },
  mixins: [user],
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
      if (this.cook && publicRecipes) {
        return publicRecipes.filter(recipe => {
          return recipe.ownerID === this.cook.id;
        });
      }
      return [];
    },
    isFollowingUser() {
      if (this.followed !== null) return this.followed;
      else {
        if (this.user && this.user.following && this.cook.id) {
          return Object.values(this.user.following).indexOf(this.cook.id) > -1;
        }
      }
    }
  },
  methods: {
    getUser(){
      let params = this.$route.params;
      console.log("Getting user");
      const db = getDatabase();
      get(ref(db, "users"), snapshot => {
        if (snapshot.exists() && snapshot.val()) {
          let userPath = `${params.key}/${params.userid}/`;
          let users = snapshot.val();

          for (let key in users) {
            let user = users[key];
            let path = generatePath(user.displayName, key, true);
            if (userPath === path) {
              this.cook = userModel(user, key);
            }
          }
        }
      }).then(() => {
        this.loadedProfile = true;
      }).catch(error => {
        console.log("Unable to get user:", error);
        this.loadedProfile = true;
      })
    },
    followUser() {
      try {
        const db = getDatabase();
        let currentUserRef = ref(db, `users/${this.user.id}/following`);

        currentUserRef.once("value", async snapshot => {
          let followingAlready = false;

          if (snapshot.exists()) {
            console.log("Snapshot.val:", snapshot.val());
            snapshot.forEach(value => {
              if (value.val() === this.cook.id) {
                followingAlready = true;
                return;
              }
            });

            if (followingAlready) {
              this.systemMessage = "You're already following " + this.cook.displayName;
            }
          }
          if (!followingAlready) {
            currentUserRef
              .push(this.cook.id)
              .then(() => {
                this.followed = true;
                this.$store.dispatch("SET_USER");
              })
              .catch(error => {
                console.log(error);
                this.systemMessage = error.message;
              });
          }
        });
      } catch (error) {
        console.log("Error while trying to follow user:", error.message);
      }
    },
    unfollowUser() {
      try {
        const db = getDatabase();
        let userRef = ref(db, `users/${this.user.id}/following`);

        userRef.once("value", snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(value => {
              if (value.val() === this.cook.id) {
                userRef
                  .child(value.key)
                  .remove()
                  .then(() => {
                    this.followed = false;
                    this.$store.dispatch("SET_USER");
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            });
          }
        });
      } catch (error) {
        console.log("Error while trying to unfollow user:", error.message);
      }
    }
  },
  created() {
    if(useCurrentUser()) this.getUser();
    else this.loadedProfile = true;
  }
};
</script>
