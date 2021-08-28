<template>
  <div  class="recipe-preview">
    <!-- Image -->
    <div :style="`background-image: url(${recipeImage})`" class="recipe-preview_image"></div>

    <add-to-favorites :recipe-key="recipe.id" :favorites-count="recipe.favoritesCount"/>

    <span class="recipe-preview_published-by" v-if="inPublicList">
      {{ `${$t("recipes.publishedBy")} ${author && author.displayName}` }}
    </span>

    <span class="recipe-preview_public-note" v-if="showPublicNote">
      {{$t("recipes.public") }}
    </span>

    <nuxt-link :to="localePath(`/recipes/${recipe.path}`)" class="full-width padding-xl">
      <!-- Details -->

      <div class="recipe-preview_category-note">
        <p v-if="typeOfMeal">
          <b>{{ $t("recipes.typeOfMeal") }}: </b>
          {{ typeOfMeal }}
        </p>
        <p v-if="freeFrom">
          <b>{{ $t("recipes.freeFrom") }}:</b>
          {{ freeFrom }}
        </p>
      </div>

      <rating :rating="recipe.rating" :recipeKey="recipe.id" :deactivated="true" />

      <!-- Description -->
      <h3 class="recipe-preview_title margin--none margin-bottom-md">
        {{ recipe.title ? recipe.title : $t("recipes.noTitle") }}
      </h3>

      <div v-if="recipe.description" class="recipe-preview_description margin-bottom-lg">
        {{ recipe.description }}
      </div>

      <!-- Categories -->
      <div>
        <div class="recipe-preview_categories">
          <span class="recipe-preview_category" v-for="category in categories" :key="category">
            {{ category }}
          </span>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import recipeBackupImg from "assets/graphics/icons/recipe-backup-img.svg";
import user from "~/mixins/user.js";
import getRecipeAuthor from "~/mixins/get-recipe-author.js";
import LoginContainer from "~/components/Login/LoginContainer";
import Rating from "~/components/RecipeFullView/Interaction/Rating";
import AddToFavorites from '../RecipeFullView/Interaction/AddToFavorites.vue';

export default {
  name: "recipe-preview",
  components: {
    LoginContainer,
    recipeBackupImg,
    Rating,
    AddToFavorites
  },
  props: {
    recipe: {
      type: Object,
      default: () => {}
    },
    inPublicList: {
      type: Boolean,
      default: false
    }
  },
  mixins: [user, getRecipeAuthor],
  computed: {
    showPublicNote() {
      return (
        !this.inPublicList &&
        this.user &&
        this.user.id === this.recipe.ownerID &&
        this.recipe.public
      );
    },
    recipeImage() {
      let photoURL = this.recipe.photoURL;
      return photoURL
        ? photoURL
        : require("assets/graphics/icons/recipe-backup-img.png");
    },
    categories() {
      let allCategories = this.$store.state.allCategories.categories;
      let localeCategories = this.$t("recipes.allCategories.categories");

      let categories = this.recipe.categories;
      return (
        categories &&
        Object.values(categories).map(category => {
          let index = allCategories.indexOf(category);
          return localeCategories[index];
        })
      );
    },
    typeOfMeal() {
      let typeOfMeal = [];
      let allTypesOfMeal = this.$store.state.allCategories.typeOfMeal;
      let localeTypesOfMeal = this.$t("recipes.allCategories.typeOfMeal");
      if (this.recipe && this.recipe.typeOfMeal) {
        this.recipe.typeOfMeal.forEach(type => {
          let index = allTypesOfMeal.indexOf(type);
          type = localeTypesOfMeal[index];
          type = type.charAt(0).toUpperCase() + type.slice(1);
          typeOfMeal.push(type);
        });
      }
      return typeOfMeal.join(", ");
    },
    freeFrom() {
      let freeFrom = [];
      let allAllergens = this.$store.state.allCategories.allergens;
      let localeAllergens = this.$t("recipes.allCategories.allergens");
      if (this.recipe && this.recipe.freeFrom) {
        this.recipe.freeFrom.forEach(allergen => {
          let index = allAllergens.indexOf(allergen);
          allergen = localeAllergens[index];
          allergen = allergen.charAt(0).toUpperCase() + allergen.slice(1);
          freeFrom.push(allergen);
        });
      }
      return freeFrom.join(", ");
    }
  },
  mounted(){
    this.getRecipeAuthor(this.recipe.ownerID);
  }
};
</script>
