<template>
  <div  class="recipe-preview">
    <!-- Image -->
    <div class="recipe-preview_image">
      <img v-if="recipe?.photoURL" :src="recipe.photoURL" />
      <RecipeBackupImg v-else filled />
    </div>

    <AddToFavorites :recipeKey="recipe.id" :favoritesCount="recipe.favoritesCount"/>

    <span class="recipe-preview_published-by" v-if="inPublicList">
      {{ `${$t("recipes.publishedBy")} ${author?.displayName || '...'}` }}
    </span>

    <span class="recipe-preview_public-note" v-if="showPublicNote">
      {{$t("recipes.public") }}
    </span>

    <NuxtLink :to="$localePath(`/recipes/${recipe.path}`)" class="recipe-preview_content">
      
      <Rating :rating="recipe.rating" :recipeKey="recipe.id" :deactivated="true" />
      
      <!-- Title -->
      <h3 class="recipe-preview_title margin--none margin-bottom-md">
        {{ recipe?.title || $t("recipes.noTitle") }}
      </h3>
      
      <!-- Categories -->
      <div class="recipe-preview_categories">
        <span class="recipe-preview_category" v-for="category in categories" :key="category">
          {{ category }}
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import RecipeBackupImg from "~/assets/graphics/illustrations/recipe-backup-img.svg";
import useRecipeAuthor from "~/composables/recipeAuthor.js";
import Rating from "~/components/Rating";
import AddToFavorites from '~/components/AddToFavorites.vue';
import { useAuthStore, useRecipeStore } from "~/store";

const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const { tm } = useI18n();

const props = defineProps({
  recipe: {
    type: Object,
    default: () => {}
  },
  inPublicList: {
    type: Boolean,
    default: false
  }
})

const { content: author} = await useRecipeAuthor(props.recipe.ownerID)

const showPublicNote = computed(() => (
  !props.inPublicList &&
  authStore.user &&
  authStore.user.id === props.recipe.ownerID &&
  props.recipe?.public
));

const recipeImage = computed(() => {
  return props.recipe.photoURL || recipeBackupImg;
});

const categories = computed(() => {
  const allCategories = recipeStore.allCategories.categories;
  const localeCategories = tm("recipes.allCategories.categories");
  const recipeCategories = props.recipe.categories;

  return (
    recipeCategories &&
    Object.values(recipeCategories).map(category => {
      const index = allCategories.indexOf(category);
      return localeCategories[index].body.static;
    })
  );
});

</script>
