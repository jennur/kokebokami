<template>
  <section class="full-width padding--xlarge">
    <form class="add-recipe-form margin--auto" v-on:submit.prevent>
      <fieldset class="flex-column">
        <label>
          Recipe title
          <input
            class="add-recipe-form__title"
            type="text"
            id="title"
            placeholder="Give your recipe a descriptive title"
            v-model="title"
          />
        </label>
        <label>
          Recipe description
          <textarea
            class="add-recipe-form__description"
            id="description"
            placeholder="Say something about the recipe."
            v-model="description"
          />
        </label>
      </fieldset>
      <fieldset id="ingredientList" class="flex-row flex-row--nowrap">
        <input
          type="text"
          placeholder="3 dl joy"
          v-for="ingredientNumber in ingredientNumberList"
          :key="ingredientNumber"
          :id="'ingredient' + ingredientNumber"
        />
        <button
          class="button button--small margin-top--medium"
          @click="incrementIngredientNumber"
        >Add ingredient</button>
      </fieldset>
      <fieldset>
        <textarea
          class="add-recipe-form__instructions"
          id="instructions"
          placeholder="Recipe instructions"
          v-model="instructions"
        />
      </fieldset>
      <button class="button button--block margin--auto" @click="saveRecipe">Save recipe</button>
    </form>
    <div class="system-message">{{ systemMessage }}</div>
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import { db } from "~/plugins/firebase.js";
export default {
  name: "add-recipe",
  components: {},
  mixins: [user],
  data() {
    return { title: "", description: "", instructions: "" };
  },
  props: {
    systemMessage: { type: String, default: "" },
    ingredientNumberList: { type: Array, default: () => [1] }
  },
  computed: {},
  methods: {
    incrementIngredientNumber() {
      let lastIngredientNumber = this.ingredientNumberList.length;
      this.ingredientNumberList.push(lastIngredientNumber + 1);
    },
    saveRecipe() {
      let ingredients = document.getElementById("ingredientList").children;
      let ingredientList = [];

      for (let i = 0; i < ingredients.length; i++) {
        ingredientList.push(ingredients[i].value);
      }

      const recipes = db.ref("recipes");
      const newRecipe = recipes.push({
        title: this.title,
        ingredients: ingredientList,
        description: this.description,
        instructions: this.instructions,
        ownerID: this.user.id
      });
      if (newRecipe !== null) {
        this.$emit("saving");
      } else
        this.systemMessage =
          "Unable to save recipe. Try again later or contact support if issue continues.";
    }
  }
};
</script>

