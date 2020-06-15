<template>
  <div class="tablet-width margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="margin-vertical--xxlarge">
      <h2>Shopping list</h2>
      <shopping-list :shoppingList="shoppingList" :user="user" />
    </div>
  </div>
</template>

<script>
import ShoppingList from "~/components/ShoppingList/ShoppingList.vue";
import user from "~/mixins/user.js";

export default {
  name: "addRecipe",
  components: { ShoppingList },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My account", link: "/account/" },
        { name: "Shopping list" }
      ]
    }
  },
  mixins: [user],
  computed: {
    shoppingList() {
      return this.user.shoppingList;
    }
  }
};
</script>
