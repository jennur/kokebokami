<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <recipe-full-view
      v-if="recipe"
      :recipe="recipe"
      :isRecipeOwner="true"
      @update="saveRecipe"
    />
  </div>
</template>

<script>
import userRecipes from "~/mixins/user-recipes.js";
import RecipeFullView from "~/components/Recipes/RecipeFullView/RecipeFullView.vue";
import user from "~/mixins/user.js";

export default {
  name: "addRecipe",
  head() {
    return {
      title: `Add new recipe | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/add-recipe/"
        }
      ]
    };
  },
  components: { RecipeFullView },
  mixins: [user],
  data() {
    return {
      recipeKey: null,
      recipe: {
        public: false,
        title: "",
        description: "",
        ingredients: [],
        instructions: [],
        categories: [],
        typeOfMeal: [],
        freeFrom: [],
      }
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
        {
          name: this.$t("navigation.myCookbook"),
          link: "/account/my-cookbook/"
        },
        { name: this.$t("navigation.addRecipe") }
      ];
    }
  },
  methods: {
    saveRecipe(payload) {
      let recipeKey = this.recipeKey;

      if (!recipeKey) {
        let recipeObj = {
          ...payload,
          ownerID: this.user.id
        };

        this.$fire.database.ref("recipes")
          .push(recipeObj)
          .then(result => {
            console.log("Saved new recipe");
            this.recipeKey = result.key;
          })
          .then(() => {
            this.getRecipe();
          });
      }
      else {
        this.$fire.database
          .ref(`recipes/${recipeKey}`)
          .update(payload)
          .then(() => {
            console.log("Successfully set payload:", payload);
          })
          .then(() => {
            this.getRecipe();
          });
      }
    },
    getRecipe() {
      if (this.user) {
        let recipeRef = this.$fire.database.ref(`recipes/${this.recipeKey}`);
        recipeRef
          .once("value", recipe => {
            if (recipe.exists()) {
              this.recipe = recipe.val();
            }
          })
          .catch(error =>
            console.log("Error: Failed getting recipe:", error.message)
          );
      }
    }
  }
};
</script>
