<template>
  <div>
    <div id="fb-root"></div>
    <div class="flex-center-container" v-if="!loaded">
      <span class="simple-loading-spinner" />
    </div>
    <BreadCrumbs v-if="loaded" class="margin-bottom-lg" :routes="breadcrumbs" />

    <div class="tablet-width margin-top-2xl margin-auto">
      <expand-transition :show="loaded" slower>
        <recipe-full-view
          class="margin-bottom-2xl"
          :recipe="recipe"
          :author="author"
          :isRecipeOwner="user && user.id === recipe.ownerID"
          @update="handleUpdate"
        />
      </expand-transition>

      <comments-section
        v-if="loaded"
        class="tablet-width margin-auto margin-top-2xl"
        :recipeKey="recipe.id"
        :recipeOwnerID="recipe.ownerID"
        :recipeTitle="recipe.title"
      />
    </div>
  </div>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";

import useRecipeData from "../../../composables/recipeData";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import RecipeFullView from "~/components/RecipeFullView/RecipeFullView.vue";
import CommentsSection from "~/components/CommentsSection/CommentsSection.vue";
import { onMounted } from "vue";
import { useAuthStore } from "~/store";
import { useRoute } from "vue-router";

const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();
const db = getDatabase();

console.log("ROUTE PARAMS:", route.params);
const { headData, recipe, author, loaded, userHasAccess } = useRecipeData(route.params);

useHead(() => ({
  ...headData,
  title: `${recipe.title || ""} | Kokebokami`,
}));

const breadcrumbs = computed(() => {
  if (authStore.user.value?.id === recipe.ownerID)
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
      { name: recipe.title },
    ];
  return [{ name: t("navigation.recipes"), link: "/" }, { name: recipe.title }];
});

function handleUpdate() {
  let date = new Date();
  date = date.toISOString();

  if (!recipe.datePublished) {
    set(ref(db, `recipes/${recipe.id}/datePublished`), date);
  } else {
    set(ref(db, `recipes/${recipe.id}/dateModified`));
  }

  useRecipeData()
}
onMounted(() => {
  const router = useRouter();
  if (recipe && !userHasAccess(recipe)) {
    router.push($localePath("no-access"));
  }
});
</script>
