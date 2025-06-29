<template>
  <div>
    <BreadCrumbs :routes="breadcrumbs" />
    <RecipeFullView
      v-if="recipe"
      :recipe="recipe"
      :isRecipeOwner="true"
      @update="saveRecipe"
    />
  </div>
</template>

<script setup>
import {
  getDatabase,
  ref as dbRef,
  get,
  update,
  push,
} from "firebase/database";
import RecipeFullView from "~/components/RecipeFullView/RecipeFullView.vue";
import { useAuthStore } from "~/store";

const authStore = useAuthStore();

const db = getDatabase();

useHead(() => {
  return {
    title: `Add new recipe | Kokebokami`,
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/add-recipe/",
      },
    ],
  };
});

const recipeKey = ref(null);
const recipe = reactive({
  public: false,
  title: "",
  description: "",
  ingredients: [],
  instructions: [],
  categories: [],
  typeOfMeal: [],
  freeFrom: [],
});

const breadcrumbs = computed(() => {
  return [
    { name: this.$t("navigation.home"), link: "/" },
    {
      name: this.$t("navigation.myAccount"),
      link: "/account/",
    },
    {
      name: this.$t("navigation.myCookbook"),
      link: "/account/my-cookbook/",
    },
    { name: this.$t("navigation.addRecipe") },
  ];
});

function saveRecipe(recipeObj) {
  let date = new Date();
  date = date.toISOString();

  if (!recipeKey.value) {
    recipeObj = {
      ...recipeObj,
      datePublished: date,
      ownerID: authStore.user.id,
    };

    push(dbRef(db, "recipes"), recipeObj)
      .then((result) => {
        console.info("[saveRecipe] Successfully saved new recipe");
        recipeKey.value = result.key;
      })
      .then(() => {
        getRecipe();
      })
      .catch((error) => console.error("[saveRecipe]", error.message));
  } else {
    recipeObj = recipeObj || {};

    update(dbRef(db, `recipes/${recipeKey}`), recipeObj)
      .then(() => {
        console.info("[saveRecipe] Successfully updated recipe:", recipeObj);
      })
      .then(() => {
        getRecipe();
      })
      .catch((error) => console.error("[saveRecipe]", error.message));
  }
}

function getRecipe() {
  if (authStore.user?.id) {
    get(dbRef(db, `recipes/${recipeKey.value}`))
      .then((snapshot) => {
        if (snapshot.exists()) recipe.value = snapshot.val();
      })
      .catch((error) => console.error("[getRecipe]", error.message));
  }
}
</script>
