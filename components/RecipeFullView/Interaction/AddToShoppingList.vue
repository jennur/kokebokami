<template>
  <div class="add-to-shopping-list">
    <div v-if="user && user.id">
      <button
        v-if="!addingToShoppingList && !addedToShoppingList"
        class="button--increment"
        @click="(event) => openSelect(event)"
      >
        {{ $t("recipes.addToShoppingList") }}
      </button>
      <div v-if="addingToShoppingList" class="flex-row flex-row--align-center">
        <SelectComponent
          v-if="!addNewShoppingList"
          :options="options"
          @select="handleSelect"
          :preSelected="options[0]"
          defaultValue="none"
        />
        <input
          v-else
          type="text"
          placeholder="New list title"
          v-model="newListTitle"
        />
        <button
          class="button button-sm button--dynamic button--green-border padding-md margin-left-md"
          @click="addToShoppingList"
        >
          {{ $t("add") }}
        </button>
      </div>
      <span
        v-if="!addingToShoppingList && addedToShoppingList"
        class="button--checked"
        >{{ $t("recipes.addedToShoppingList") }}</span
      >
    </div>

    <button
      v-else
      class="button button-xs button--round button--green padding-h-lg margin-bottom-2xl"
      @click="(event) => openModal(event)"
    >
      {{ $t("recipes.loginToAddToShoppingList") }}
    </button>
  </div>
</template>

<script setup>
import { getDatabase, ref, child, push } from "firebase/database";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import { useMainStore, useShoppingListStore, useAuthStore } from "~/store";

const db = getDatabase();
const mainStore = useMainStore();
const shoppingListStore = useShoppingListStore();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const props = defineProps({
  recipeTitle: {
    type: String,
    default: "",
  },
  ingredients: {
    type: Array,
    default: () => [],
  },
});

const chosenShoppingList = ref([]);
const newListTitle = ref("");
const addingToShoppingList = ref(false);
const addedToShoppingList = ref(false);
const addNewShoppingList = ref(false);

const options = computed(() => {
  const listTitles = shoppingLists.map((list) => {
    return list.title || "Untitled list";
  });

  listTitles.push("Create new list");
  return listTitles;
});

function openModal(event) {
  event && event.stopPropagation();
  mainStore.SHOW_LOGIN_MODAL({
    open: true,
    headline: "Log in to add to shopping list",
  });
}

function openSelect(event) {
  event && event.stopPropagation();
  chosenShoppingList.value = shoppingLists?.key;
  addingToShoppingList.value = true;
}

function handleSelect(option) {
  let listFound = false;

  shoppingListStore.shoppingLists.forEach((list) => {
    if (list.title === option) {
      chosenShoppingList.value = list;
      listFound = true;
    }
  });
  if (!listFound) {
    addNewShoppingList.value = true;
  }
}

function addToShoppingList() {
  const listItems = props.ingredients.map((ingredient) => {
    return {
      text: `${ingredient.amount}  ${ingredient.item}`,
      complete: false,
    };
  });

  if (
    newListTitle.value === "" &&
    chosenShoppingList.value &&
    chosenShoppingList.value.key
  ) {
    push(
      child(
        ref(db, `shoppingLists/${chosenShoppingList.value.key}`),
        "subLists",
        {
          title: props.recipeTitle,
          listItems,
        }
      )
    )
      .then(() => {
        console.log(
          "Successfully added to shoppingList:",
          chosenShoppingList.value.title
        );
        shoppingListStore.REFRESH();
        addedToShoppingList.value = true;
        addingToShoppingList.value = false;
      })
      .catch((error) =>
        console.log("Failed to add to shopping list:", error.message)
      );
  } else if (newListTitle.value !== "") {
    const userObj = {
      id: user.value.id,
      displayName: user.value.displayName,
    };
    const shoppingListRef = ref(db, `shoppingLists`);

    push(shoppingListRef, {
      title: newListTitle.value,
      createdBy: userObj,
      owners: [userObj],
    }).then((shoppingList) => {
      push(child(child(shoppingListRef), shoppingList.key), "subLists", {
        title: props.recipeTitle,
        listItems,
      })
        .then(() => {
          console.log(
            "Successfully added to shoppingList:",
            newListTitle.value
          );
          shoppingListStore.REFRESH();
          addedToShoppingList.value = true;
          addingToShoppingList.value = false;
          addNewShoppingList.value = false;
        })
        .catch((error) =>
          console.log("Failed to add to shopping list:", error.message)
        );
    });
  }
}
</script>
