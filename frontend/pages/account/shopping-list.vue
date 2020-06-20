<template>
  <div class="tablet-width margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="margin-vertical--xxlarge">
      <shopping-list
        v-for="(shoppingList,index) in shoppingLists"
        :key="`shopping-list-${index}`"
        :title="shoppingList[1].title"
        :subLists="objectToEntries(shoppingList[1].subLists)"
        :mainListKey="shoppingList[0]"
        @update="updateShoppingLists"
      />
      <shopping-list
        v-if="addingNewShoppingList"
        :title="'New shopping list'"
        :subLists="[]"
        :mainListKey="''"
        @update="updateShoppingLists"
        @cancel="addingNewShoppingList = false"
      />
    </div>
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-bottom--xxlarge"
        @increment="addNewShoppingList"
      >Add new shopping list</increment-button>
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
      console.log("Updating in shopping-list");
      this.addingNewShoppingList = false;
      this.getShoppingLists();
      let user = this.user;
      let shoppingList = this.shoppingLists;
      let userObj = { ...user, shoppingLists };
      this.$store.dispatch("SET_USER", userObj);
    },
    objectToEntries(object) {
      return object ? Object.entries(object) : [];
    }
  }
};
</script>
