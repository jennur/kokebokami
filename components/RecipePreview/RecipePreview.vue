<template>
  <div  class="recipe-preview">
    <!-- Image -->
    <div :style="`background-image: url(${recipeImage})`" class="recipe-preview_image"></div>

    <span class="recipe-preview_favorite-icon" :class="{'selected': isUserFavorite}" @click="event => handleFavorites(event)">
      <favorite-icon class="icon"/>
    </span>

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

      <!-- Description -->
      <h3 class="recipe-preview_title margin--none margin-bottom-md">
        {{ recipe.title ? recipe.title : $t("recipes.noTitle") }}
      </h3>

      <div class="recipe-preview_description margin-bottom-lg">
        {{ recipe.description ? recipe.description : $t("recipes.noDescription") }}
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
import favoriteIcon from "~/assets/graphics/icons/favorites-icon.svg";
import LoginContainer from "~/components/Login/LoginContainer";

export default {
  name: "recipe-preview",
  components: {
    LoginContainer,
    recipeBackupImg,
    favoriteIcon
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
    },
    isUserFavorite() {
      if(this.user && this.user.id) {
        let favorites = this.$store.state.user.favorites;
        return favorites && Object.values(favorites).indexOf(this.recipe.id) > - 1;
      }
      return false;
    }
  },
  methods: {
    handleFavorites(event) {
      event && event.stopPropagation();

      if (this.user && this.user.id) {
        let favorites = this.$store.state.user.favorites;
        let isFavorite = false;
        for(let key in favorites) {
          if(this.recipe.id === favorites[key]){
            isFavorite = true;
            this.removeFromFavorites(key);
          }
        }
        if(!isFavorite) {
          this.saveToFavorites();
        }
      } else {
        this.$store.dispatch("SHOW_LOGIN_MODAL", {open: true, headline: "Login to add to your favorites!"});
      }
    },
    saveToFavorites() {
      this.$fire.database
        .ref(`users/${this.user.id}/favorites`)
        .push(this.recipe.id)
        .then(() => {
          this.$store.dispatch("UPDATE_USER_FAVORITES");
          console.log("Successfully added to favorites");

          this.$fire.database
            .ref(`recipes/${this.recipe.id}/favoritesCount`)
            .once("value", snapshot => {
              let count = 1;
              if(snapshot.exists()){
                count = snapshot.val();
                count += 1;
              }
              this.$fire.database
                .ref(`recipes/${this.recipe.id}`)
                .update({ favoritesCount: count });
            })
        })
        .catch(error => console.log("Error saving to favorites:", error));
    },
    removeFromFavorites(key){
      this.$fire.database
        .ref(`users/${this.user.id}/favorites/${key}`)
        .remove()
        .then(() => {
          this.$store.dispatch("UPDATE_USER_FAVORITES");
          console.log("Successfully removed from favorites");

          this.$fire.database
            .ref(`recipes/${this.recipe.id}/favoritesCount`)
            .once("value", snapshot => {
              if(snapshot.exists()){
                let count = snapshot.val();
                count -= 1;

                this.$fire.database
                  .ref(`recipes/${this.recipe.id}`)
                  .update({ favoritesCount: count });
              }
            })
        })
        .catch(error => console.log("Error removing from favorites:", error));
    }
  },
  mounted(){
    this.getRecipeAuthor(this.recipe.ownerID);
  }
};
</script>
