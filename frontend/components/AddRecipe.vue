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
        <span
          class="flex-row flex-row--align-center"
          v-for="ingredientNumber in ingredientNumberList"
          :key="ingredientNumber"
        >
          <input
            type="text"
            placeholder="Amount of something"
            :id="'ingredient' + ingredientNumber"
          />
          <button
            :data-ingredient-ref="ingredientNumber"
            class="remove-icon"
            title="Remove ingredient"
            @click="(event)=>removeIngredient(event)"
          ></button>
        </span>
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
      let list = this.ingredientNumberList;
      let ingredientNumber = list.length === 0 ? 1 : Math.max.apply(null, list);
      this.ingredientNumberList.push(ingredientNumber + 1);
    },
    removeIngredient(event) {
      let ingredientNumber = event.target.getAttribute("data-ingredient-ref");
      this.ingredientNumberList.splice(
        this.ingredientNumberList.indexOf(parseInt(ingredientNumber)),
        1
      );
    },
    saveRecipe() {
      let ingredients = document.querySelectorAll("#ingredientList input");
      let ingredientList = [];

      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].value) {
          ingredientList.push(ingredients[i].value);
        }
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

