<template>
  <div>
    <div id="fb-root"></div>
    <div class="flex-center-container" v-if="!loaded">
      <span class="simple-loading-spinner"></span>
    </div>
    <BreadCrumbs v-if="loaded" class="margin-bottom-lg" :routes="breadcrumbs" />

    <div class="tablet-width margin-top-2xl margin-auto">
      <ExpandTransition :show="loaded" slower>
        <RecipeFullView
          v-if="recipe?.id"
          class="margin-bottom-2xl"
          :recipe="recipe"
          :author="author"
          :isRecipeOwner="
            recipe?.ownerID && authStore.user?.id === recipe.ownerID
          "
          @update="handleUpdate"
        />
      </ExpandTransition>

      <CommentsSection
        v-if="loaded"
        class="tablet-width margin-auto margin-top-2xl"
        :recipeKey="recipe?.id"
        :recipeOwnerID="recipe?.ownerID"
        :recipeTitle="recipe?.title"
        :comments="recipe?.comments"
      />
    </div>
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import useRecipeData from "../../../composables/recipeData";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import RecipeFullView from "~/components/RecipeFullView/RecipeFullView.vue";
import CommentsSection from "~/components/CommentsSection/CommentsSection.vue";
import { onBeforeMount } from "vue";
import { useAuthStore } from "~/store";
import { useRoute } from "vue-router";

const { $localePath } = useNuxtApp();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();
const db = getDatabase();

const { headData, recipe, author, loaded, userHasAccess, refresh } =
  await useRecipeData(route.params);

useHead(() => ({
  ...headData,
  title: `${recipe.value?.title || ""} | Kokebokami`,
}));

const breadcrumbs = computed(() => {
  if (authStore.user?.id === recipe.value?.ownerID) {
    return [
      { name: t("navigation.home"), link: "/" },
      {
        name: t("navigation.myAccount"),
        link: "/account/",
      },
      {
        name: t("navigation.myCookbook"),
        link: "/account/my-cookbook/",
      },
      { name: recipe.value?.title },
    ];
  }
  return [
    { name: t("navigation.recipes"), link: "/" },
    { name: recipe.value?.title },
  ];
});

function handleUpdate() {
  try {
    const date = new Date().toISOString();
    const datePublished = recipe.value?.datePublished;

    set(
      dbRef(
        db,
        `recipes/${recipe.value?.id}/${
          datePublished ? "dateModified" : "datePublished"
        }`
      ),
      date
    );

    refresh();
  } catch (error) {
    console.error("[handleUpdate]", error.message);
  }
}
onBeforeMount(() => {
  if (recipe.value && !userHasAccess()) {
    navigateTo($localePath("no-access"));
  }
});
</script>
