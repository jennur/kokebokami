<template>
  <nuxt-link :to="'/recipes/' + recipeUrl" class="recipe-display padding--xlarge">
    <h3
      class="recipe-display__title margin--none margin-bottom--medium"
    >{{recipe.title ? recipe.title : "Recipe has no title"}}</h3>
    <div
      class="recipe-display__description"
    >{{recipe.description ? recipe.description : "Recipe has no description"}}</div>

    <div class="recipe-display__categories">
      <span
        class="recipe-display__category margin-vertical--large margin-horizontal--small"
        v-for="category in recipe.categories"
        :key="category"
      >{{category}}</span>
    </div>

    <span
      class="recipe-display__published-by"
      v-if="publicRecipe"
    >Published by: {{recipeOwner ? recipeOwner : "Unknown"}}</span>
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
    }
  }
};
</script>
