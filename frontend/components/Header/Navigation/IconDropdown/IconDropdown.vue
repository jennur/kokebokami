<template>
  <div class="navigation__content-dropdown">
    <shopping-list-preview
      v-if="contentType === 'shoppingList'"
      :listItems="content"
    />
    <recipes-list-preview
      v-if="contentType === 'recipeList'"
      :recipes="content"
    />

    <nuxt-link :to="contentLink">See all</nuxt-link>
  </div>
</template>

<script>
import ShoppingListPreview from "./DropdownContent/ShoppingListPreview.vue";
import RecipesListPreview from "./DropdownContent/RecipesListPreview.vue";
export default {
  name: "icon-dropdown",
  components: {
    ShoppingListPreview,
    RecipesListPreview
  },
  props: {
    contentLink: {
      type: String,
      default: ""
    },
    contentType: {
      type: String,
      default: ""
    },
    content: {
      type: Array,
      default: () => []
    }
  }
};
</script>
