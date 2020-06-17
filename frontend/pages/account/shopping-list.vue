<template>
  <div class="tablet-width margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="margin-vertical--xxlarge">
      <shopping-list
        v-for="(shoppingList,index) in shoppingLists"
        :key="`shopping-list-${index}`"
        :title="shoppingList[1].title"
        :subLists="shoppingList[1].subLists"
        :listKey="shoppingList[0]"
      />
    </div>
    <increment-button
      class="margin-bottom--xxlarge"
      @increment="addNewShoppingList"
    >Add new shopping list</increment-button>
  </div>
</template>

<script>
import user from "~/mixins/user.js";

import ShoppingList from "~/components/ShoppingList/ShoppingList.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

export default {
  name: "addRecipe",
  components: { ShoppingList, IncrementButton },
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
  data() {
    return {
      shoppingLists: [
        [
          "",
          {
            title: "My shopping list",
            subLists: [{ title: "", listItems: [] }]
          }
        ]
      ]
    };
  },
  methods: {
    addNewShoppingList() {
      this.shoppingLists.push([
        "",
        { title: "New shopping list", subLists: [] }
      ]);
    }
  },
  created() {
    if (this.user) {
      let shoppingLists =
        this.user.shoppingLists &&
        JSON.parse(JSON.stringify(this.user.shoppingLists));
      if (shoppingLists) {
        this.shoppingLists = Object.entries(this.user.shoppingLists);
        console.log("ShoppingLists:", Object.entries(this.user.shoppingLists));
      }
    }
  }
};
</script>
