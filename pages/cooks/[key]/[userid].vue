<template>
  <section>
    <div v-if="authStore.user && !loadedProfile">
      <div class="flex-center-container">
        <span class="simple-loading-spinner"></span>
      </div>
    </div>

    <div v-else>
      <div v-if="authStore.user && authStore.user.id && cook && !cook.hidden">
        <BreadCrumbs :routes="breadcrumbs" />

        <div class="flex-column flex-align--end">
          <button
            v-if="isFollowingUser"
            @click="unfollowUser"
            class="button button-sm button--red-border margin-top-lg"
          >
            {{ $t("cooks.unfollow") }} {{ cook ? cook.displayName : "" }}
          </button>

          <button
            v-else
            @click="followUser"
            class="button button-sm button--green-border margin-top-lg"
          >
            {{ $t("cooks.follow") }} {{ cook ? cook.displayName : "" }}
          </button>

          <span class="system-message margin-top-md">
            {{ systemMessage }}
          </span>
        </div>

        <ProfileView class="margin-top-md" :user="cook" />

        <h3>{{ $t("cooks.checkOutMyRecipes") }}</h3>
        <RecipesList
          :recipes="cooksPublicRecipes"
          :emptyListMessage="`${username} ${$t(
            'cooks.didNotAddAnyPublicRecipes'
          )}`"
        />
      </div>

      <CookHidden v-else :hidden="cook && cook.hidden" @update="getUser" />
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref as dbRef, get, push, remove, child } from "firebase/database";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/RecipePreview/RecipesList";
import CookHidden from "~/components/Cooks/CookHidden.vue";

import generatePath from "~/helpers/generatePath";
import userModel from "~/helpers/user-model";
import { useAuthStore, useRecipeStore } from "~/store";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";

const recipeStore = useRecipeStore();
const authStore = useAuthStore();
const db = getDatabase();

const route = useRoute();
const { t } = useI18n();

const systemMessage = ref("");
const cook = ref({});
const loadedProfile = ref(false);

useHead(() => {
  const displayName = cook.value && cook.value.displayName;
  const path = (displayName && generatePath(displayName, cook.value.id)) || "";
  return {
    title: `${authStore.username} | Kokebokami`,
    link: [
      {
        rel: "canonical",
        href: `https://kokebokami.com/cooks/${path}/`,
      },
    ],
  };
});

const username = computed(() => {
  return (cook.value && cook.value.displayName) || "Unknown";
});

const breadcrumbs = computed(() => {
  if (cook.value) {
    return [
      { name: t("navigation.home"), link: "/" },
      { name: t("navigation.cooks"), link: "/cooks/" },
      { name: `${cook.value.displayName}` },
    ];
  }
});

const cooksPublicRecipes = computed(() => {
  if (cook.value && recipeStore.publicRecipes) {
    return recipeStore.publicRecipes.filter((recipe) => {
      return recipe.ownerID === cook.value.id;
    });
  }
  return [];
});

const isFollowingUser = computed(() => {
  return authStore?.followed?.some((cookObj) => cookObj.id === cook.value.id);
});

function getUser() {
  const params = route.params;

  get(dbRef(db, "users"))
    .then((snapshot) => {
      if (snapshot.exists() && snapshot.val()) {
        const userPath = `${params.key}/${params.userid}/`;
        const users = snapshot.val();

        for (const key in users) {
          const user = users[key];
          const path = generatePath(user.displayName, key, true);
          if (userPath === path) {
            cook.value = userModel(user, key);
          }
        }
      }
    })
    .then(() => {
      loadedProfile.value = true;
    })
    .catch((error) => {
      console.error("[getUser]", error);
      loadedProfile.value = true;
    });
}

function followUser() {
  if (isFollowingUser.value) {
    systemMessage.value = `You're already following ${cook.value.displayName}`;
  } else {
    push(dbRef(db, `users/${authStore.user.id}/following`), cook.value.id)
      .then(() => {
        authStore.SET_USER();
      })
      .catch((error) => {
        console.error("[followUser]", error.message);
        systemMessage.value = error.message;
      });
  }
}

function unfollowUser() {
  try {
    const followingRef = dbRef(db, `users/${authStore.user.id}/following`);

    get(followingRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((value) => {
          if (value.val() === cook.value.id) {
            remove(child(followingRef, value.key))
              .then(() => {
                authStore.SET_USER();
              })
              .catch((error) => {
                console.error("[unfollowUser]", error);
              });
          }
        });
      }
    });
  } catch (error) {
    console.error("[unfollowUser]", error.message);
  }
}

const { user } = storeToRefs(authStore);

watch(user, () => {
  if (user.value) getUser();
});

onBeforeMount(() => {
  if (authStore.user) getUser();
  else loadedProfile.value = true;
});
</script>
