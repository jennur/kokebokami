<template>
  <div class="add-to-shopping-list">
    <div v-if="user && user.id">
      <button
        v-if="!addingToShoppingList && !addedToShoppingList"
        class="button--increment"
        @click="openSelect"
      >
        {{ $t("recipes.addToShoppingList") }}
      </button>
      <div v-if="addingToShoppingList" class="flex-row flex-row--align-center">
        <select-component
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
    <button v-else
            class="button button-xs button--round button--green padding-h-lg margin-bottom-2xl"
            @click="$store.dispatch('SHOW_LOGIN_MODAL', {open: true, headline: 'Log in to add to shopping list'})"
    >
      {{ $t("recipes.loginToAddToShoppingList") }}
    </button>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import shoppingLists from "~/mixins/shopping-lists.js";
import SelectComponent from "~/components/Input/SelectComponent.vue";

export default {
  name: "add-to-shopping-list",
  components: {
    SelectComponent
  },
  props: {
    recipeTitle: {
      type: String,
      default: ""
    },
    ingredients: {
      type: Array,
      default: () => []
    }
  },
  mixins: [user, shoppingLists],
  data() {
    return {
      chosenShoppingList: [],
      newListTitle: "",
      addingToShoppingList: false,
      addedToShoppingList: false,
      addNewShoppingList: false
    };
  },
  computed: {
    options() {
      let shoppingLists = this.shoppingLists || [];
      let options = shoppingLists.map(list => {
        return list.title || "Untitled list";
      });
      options.push("Create new list");
      return options;
    }
  },
  methods: {
    openSelect() {
      let shoppingLists = this.shoppingLists;
      this.chosenShoppingList = shoppingLists && shoppingLists.key;
      this.addingToShoppingList = true;
    },
    handleSelect(option) {
      let shoppingLists = this.shoppingLists || [];
      let listFound = false;
      shoppingLists.forEach(list => {
        if (list.title === option) {
          this.chosenShoppingList = list;
          listFound = true;
        }
      });
      if (!listFound) {
        this.addNewShoppingList = true;
      }
    },
    addToShoppingList() {
      let listItems = this.ingredients.map(ingredient => {
        return {
          text: `${ingredient.amount}  ${ingredient.item}`,
          complete: false
        };
      });

      if (this.newListTitle === "" && this.chosenShoppingList && this.chosenShoppingList.key) {

        this.$fire.database
          .ref(`shoppingLists/${this.chosenShoppingList.key}`)
          .child("subLists")
          .push({
            title: this.recipeTitle,
            listItems
          })
          .then(() => {
            console.log("Successfully added to shoppingList:", this.chosenShoppingList.title);
            this.$store.dispatch("SET_SHOPPING_LIST_COUNT");
            this.addedToShoppingList = true;
            this.addingToShoppingList = false;
          })
          .catch(error =>
            console.log("Failed to add to shopping list:", error.message)
          );
      }
      else if (this.newListTitle !== "") {

        let userObj = {
          id: this.user.id,
          displayName: this.user.displayName
        }

        let shoppingListRef = this.$fire.database.ref(`shoppingLists`);

        shoppingListRef
          .push({
            title: this.newListTitle,
            createdBy: userObj,
            owners: [userObj]
          })
          .then(shoppingList => {
            shoppingListRef
              .child(shoppingList.key)
              .child("subLists")
              .push({
                title: this.recipeTitle,
                listItems
              })
              .then(() => {
                console.log("Successfully added to shoppingList:", this.newListTitle);
                this.$store.dispatch("SET_SHOPPING_LIST_COUNT");
                this.addedToShoppingList = true;
                this.addingToShoppingList = false;
                this.addNewShoppingList = false;
              })
              .catch(error =>
                console.log("Failed to add to shopping list:", error.message)
              );
          });
      }
    }
  }
};
</script>
