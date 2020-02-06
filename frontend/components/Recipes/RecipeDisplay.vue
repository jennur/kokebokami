<template>
  <nuxt-link :to="'/recipes/' + recipeUrl" class="recipe-display padding--xlarge">
    <div>
      <div class="recipe-display__category-note">
        <p v-if="typeOfMeal">
          <b>Meal type:</b>
          {{typeOfMeal}}
        </p>
        <p v-if="freeFrom">
          <b>Free from:</b>
          {{freeFrom}}
        </p>
      </div>
      <h3
        class="recipe-display__title margin--none margin-bottom--medium"
      >{{recipe.title ? recipe.title : "Recipe has no title"}}</h3>
      <div
        class="recipe-display__description"
      >{{recipe.description ? recipe.description : "Recipe has no description"}}</div>
    </div>
    <div>
      <div class="recipe-display__categories">
        <span
          class="recipe-display__category margin-vertical--large margin-horizontal--small"
          v-for="category in categories"
          :key="category"
        >{{category}}</span>
      </div>

      <span
        class="recipe-display__published-by"
        v-if="publicRecipe"
      >Published by: {{recipeOwner ? recipeOwner : "Unknown"}}</span>
    </div>
  </nuxt-link>
</template>

<script>
import { db } from "~/plugins/firebase.js";

export default {
  name: "recipe-display",

  props: {
    recipe: {
      type: Object,
      default: () => {}
    },
    recipeID: {
      type: String,
      default: ""
    },
    publicRecipe: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    recipeUrl() {
      return this.recipeID;
    },
    recipeOwner() {
      let users = this.$store.getters.allUsers;
      let recipeOwner = null;
      users.forEach(user => {
        if (this.recipe.ownerID === user[0]) {
          recipeOwner = user[1].displayName;
        }
      });
      return recipeOwner;
    },
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    allTypesOfMeal() {
      // Needed due to duplicate in previous categories
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    },
    categories() {
      let categories = [];
      if (this.recipe && this.recipe.categories) {
        this.recipe.categories.forEach(category => {
          if (this.allTypesOfMeal.indexOf(category) === -1) {
            // ^ Needed due to duplicate of typeOfMeal in previous categories
            categories.push(category);
          }
        });
      }
      return categories;
    },
    typeOfMeal() {
      let typeOfMeal = [];
      if (this.recipe && this.recipe.typeOfMeal) {
        this.recipe.typeOfMeal.forEach(type => {
          type = type.charAt(0).toUpperCase() + type.slice(1);
          typeOfMeal.push(type);
        });
      }
      return typeOfMeal.join(", ");
    },
    freeFrom() {
      let freeFrom = [];
      if (this.recipe && this.recipe.freeFrom) {
        this.recipe.freeFrom.forEach(allergen => {
          allergen = allergen.charAt(0).toUpperCase() + allergen.slice(1);
          freeFrom.push(allergen);
        });
      }
      return freeFrom.join(", ");
    }
  }
};
</script>
