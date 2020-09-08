<template>
  <div class="tablet-width margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="margin-vertical--xxlarge">
      <shopping-list
        v-for="(shoppingList, index) in shoppingLists"
        :key="`shopping-list-${index}`"
        :list="{ ...shoppingList[1], key: shoppingList[0] }"
        @update="updateShoppingLists"
      />
      <shopping-list
        v-if="addingNewShoppingList"
        :list="{ key: '', title: 'New shopping list', subLists: [] }"
        @update="updateShoppingLists"
        @cancel="addingNewShoppingList = false"
      />
    </div>
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-bottom--xxlarge"
        @increment="addNewShoppingList"
        >New shopping list</increment-button
      >
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";

import shoppingLists from "~/mixins/shoppingLists.js";

import ShoppingList from "~/components/ShoppingList/ShoppingList.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

export default {
  name: "addRecipe",
  components: { ShoppingList, IncrementButton },
  head() {
    return {
      title: `Shopping list | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/shopping-list/"
        }
      ]
    };
  },
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
  mixins: [user, shoppingLists],
  data() {
    return {
      addingNewShoppingList: false
    };
  },
  methods: {
    addNewShoppingList() {
      this.addingNewShoppingList = true;
    },
    updateShoppingLists() {
      this.addingNewShoppingList = false;
      this.getShoppingLists();
    },
    objectToEntries(object) {
      return object ? Object.entries(object) : [];
    }
  }
};
</script>
