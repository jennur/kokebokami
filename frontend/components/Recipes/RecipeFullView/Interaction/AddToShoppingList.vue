<template>
  <div class="add-to-shopping-list">
    <button
      v-if="!addingToShoppingList && !addedToShoppingList"
      class="button--increment"
      @click="openSelect"
    >Add to shopping list</button>
    <div v-if="addingToShoppingList" class="flex-row flex-row--align-center">
      <select-component
        v-if="!addNewShoppingList"
        :options="options"
        @select="handleSelect"
        :preSelected="options[0]"
        defaultValue="none"
      />
      <input v-else type="text" placeholder="New list title" v-model="newListTitle" />
      <button
        class="button button--small button--dynamic button--green-border padding--medium margin-left--medium"
        @click="addToShoppingList"
      >Add</button>
    </div>
    <span
      v-if="!addingToShoppingList && addedToShoppingList"
      class="button--checked"
    >Added to shopping list</span>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import shoppingLists from "~/mixins/shoppingLists.js";
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
        return list[1].title || "Untitled list";
      });
      options.push("New shopping list");
      return options;
    }
  },
  methods: {
    openSelect() {
      let shoppingLists = this.shoppingLists;
      this.chosenShoppingList = shoppingLists && shoppingLists[0];
      this.addingToShoppingList = true;
    },
    handleSelect(option) {
      let shoppingLists = this.shoppingLists || [];
      let listFound = false;
      shoppingLists.forEach(list => {
        if (list[1].title === option) {
          this.chosenShoppingList = list;
          listFound = true;
        }
      });
      if (!listFound) {
        this.addNewShoppingList = true;
      }
    },
    addToShoppingList() {
      let componentThis = this;
      let recipeTitle = this.recipeTitle;
      let ingredients = this.ingredients;
      let shoppingListIngredients = ingredients.map(ingredient => {
        let text = ingredient.join(" ");
        let complete = false;
        return { text, complete };
      });
      let chosenShoppingList = this.chosenShoppingList;
      if (
        this.newListTitle === "" &&
        chosenShoppingList &&
        chosenShoppingList[0]
      ) {
        let shoppingListKey = chosenShoppingList[0];
        let shoppingListRef = this.$fireDb.ref(
          `users/${this.user.id}/shoppingLists/${shoppingListKey}`
        );

        shoppingListRef
          .child("subLists")
          .push({
            title: recipeTitle,
            listItems: shoppingListIngredients
          })
          .then(() => {
            console.log(
              "Successfully added to shoppingList:",
              chosenShoppingList[1].title
            );
            let shoppingListCount =
              componentThis.$store.state.shoppingListCount;
            shoppingListCount += shoppingListIngredients.length;
            componentThis.$store.dispatch(
              "SET_SHOPPING_LIST_COUNT",
              shoppingListCount
            );
            componentThis.addedToShoppingList = true;
            componentThis.addingToShoppingList = false;
          })
          .catch(error =>
            console.log("Failed to add to shopping list:", error.message)
          );
      } else if (this.newListTitle !== "") {
        let title = this.newListTitle;
        let newShoppingListRef = this.$fireDb.ref(
          `users/${this.user.id}/shoppingLists`
        );

        newShoppingListRef.push({ title }).then(shoppingList => {
          console.log("Key:", shoppingList.key);
          newShoppingListRef
            .child(shoppingList.key)
            .child("subLists")
            .push({
              title: recipeTitle,
              listItems: shoppingListIngredients
            })
            .then(() => {
              console.log("Successfully added to shoppingList:", title);
              let shoppingListCount =
                componentThis.$store.state.shoppingListCount;
              shoppingListCount += shoppingListIngredients.length;
              componentThis.$store.dispatch(
                "SET_SHOPPING_LIST_COUNT",
                shoppingListCount
              );
              componentThis.addedToShoppingList = true;
              componentThis.addingToShoppingList = false;
              componentThis.addNewShoppingList = false;
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
