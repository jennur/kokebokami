<template>
  <div  class="recipe-preview">
    <!-- Image -->
    <div :style="`background-image: url(${recipeImage})`" class="recipe-preview_image"></div>

    <AddToFavorites :recipe-key="recipe.id" :favorites-count="recipe.favoritesCount"/>

    <span class="recipe-preview_published-by" v-if="inPublicList">
      {{ `${$t("recipes.publishedBy")} ${author && author.displayName || '...'}` }}
    </span>

    <span class="recipe-preview_public-note" v-if="showPublicNote">
      {{$t("recipes.public") }}
    </span>

    <NuxtLink :to="$localePath(`/recipes/${recipe.path}`)" class="recipe-preview_content">
      
      <Rating :rating="recipe.rating" :recipeKey="recipe.id" :deactivated="true" />
      
      <!-- Title -->
      <h3 class="recipe-preview_title margin--none margin-bottom-md">
        {{ recipe.title ? recipe.title : $t("recipes.noTitle") }}
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
import recipeBackupImg from "assets/graphics/icons/recipe-backup-img.svg";
import useRecipeAuthor from "~/composables/recipeAuthor.js";
import Rating from "~/components/RecipeFullView/Interaction/Rating";
import AddToFavorites from '../RecipeFullView/Interaction/AddToFavorites.vue';
import { computed } from "vue";
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
const user = computed(() => authStore.user);
const showPublicNote = computed(() => (
  !props.inPublicList &&
  user &&
  user.id === props.recipe.ownerID &&
  props.recipe.public
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
