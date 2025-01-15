<template>
  <div>
    <BreadCrumbs :routes="breadcrumbs" />
    <recipe-full-view
      v-if="recipe"
      :recipe="recipe"
      :isRecipeOwner="true"
      @update="saveRecipe"
    />
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

import RecipeFullView from "~/components/RecipeFullView/RecipeFullView.vue";
import user from "~/composables/user.js";

export default {
  name: "addRecipe",
  head() {
    return {
      title: `Add new recipe | Kokebokami`,
      meta: [
        {
          name: "robots" ,
          content: "noindex"
        }
      ],
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
    saveRecipe(recipeObj) {
      let recipeKey = this.recipeKey;
      let date = new Date;
      date = date.toISOString();

      if (!recipeKey) {
        recipeObj = {
          ...recipeObj,
          datePublished: date,
          ownerID: this.user.id
        };
        const db = getDatabase();
        ref(db, "recipes")
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
        recipeObj = recipeObj || {};
        const db = getDatabase();
          ref(db, `recipes/${recipeKey}`)
          .update(recipeObj)
          .then(() => {
            console.log("Successfully updated recipe:", recipeObj);
          })
          .then(() => {
            this.getRecipe();
          });
      }
    },
    getRecipe() {
      if (this.user) {
        const db = getDatabase();
        let recipeRef = ref(db, `recipes/${this.recipeKey}`);
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
