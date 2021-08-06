<template>
  <div class="tablet-width margin-auto">
    <breadcrumbs :routes="breadcrumbs" />
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-top-2xl"
        @increment="addNewShoppingList"
      >
        New shopping list
      </increment-button>
    </div>
    <div class="margin-v-2xl">
      <shopping-list
        v-if="addingNewShoppingList"
        :list="{ key: '', title: 'New shopping list', subLists: [] }"
        @update="updateShoppingLists"
        @cancel="addingNewShoppingList = false"
      />
      <shopping-list
        v-for="(shoppingList, index) in shoppingLists"
        :key="`shopping-list-${index}`"
        :list="shoppingList"
        @update="updateShoppingLists"
      />
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";

import shoppingLists from "~/mixins/shopping-lists.js";

import ShoppingList from "~/components/ShoppingList/ShoppingList.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

export default {
  name: "addRecipe",
  components: { ShoppingList, IncrementButton },
  head() {
    return {
      title: `Shopping list | Kokebokami`,
      meta: [
        {
          name: "robots" ,
          content: "noindex"
        }
      ],
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/shopping-list/"
        }
      ]
    };
  },
  mixins: [user, shoppingLists],
  data() {
    return {
      addingNewShoppingList: false
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        {
          name: this.$t("navigation.myAccount"),
          link: "/account/"
        },
        { name: this.$t("navigation.shoppingLists") }
      ];
    }
  },
  methods: {
    addNewShoppingList() {
      this.addingNewShoppingList = true;
    },
    updateShoppingLists() {
      this.addingNewShoppingList = false;
      this.getShoppingLists();
    }
  }
};
</script>
