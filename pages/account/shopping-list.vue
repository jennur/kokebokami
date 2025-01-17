<template>
  <div class="tablet-width margin-auto">
    <BreadCrumbs :routes="breadcrumbs" />
    <div class="flex-row flex-row--align-center">
      <IncrementButton class="margin-top-2xl" @increment="addNewShoppingList">
        {{ $t("shoppingLists.newList") }}
      </IncrementButton>
    </div>
    <div class="margin-v-2xl">
      <ShoppingList
        v-if="addingNewShoppingList"
        :list="{ key: '', title: $t('shoppingLists.newList'), subLists: [] }"
        @update="updateShoppingLists"
        @cancel="addingNewShoppingList = false"
      />
      <ShoppingList
        v-for="(shoppingList, index) in shoppingListStore.shoppingLists"
        :key="`shopping-list-${index}`"
        :list="shoppingList"
        @update="updateShoppingLists"
      />
    </div>
  </div>
</template>

<script setup>
import ShoppingList from "~/components/ShoppingList/ShoppingList.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";
import { useShoppingListStore } from "~/store";

const shoppingListStore = useShoppingListStore();

const { t } = useI18n();

useHead(() => {
  return {
    title: `Shopping list | Kokebokami`,
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/shopping-list/",
      },
    ],
  };
});

const addingNewShoppingList = ref(false);

const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    {
      name: t("navigation.myAccount"),
      link: "/account/",
    },
    { name: t("navigation.shoppingLists") },
  ];
});

function addNewShoppingList() {
  addingNewShoppingList.value = true;
}

function updateShoppingLists() {
  addingNewShoppingList.value = false;
  shoppingListStore.REFRESH()
}
</script>
