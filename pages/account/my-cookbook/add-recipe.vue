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
import { getDatabase, ref, get, update } from "firebase/database";
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

const user = computed(() => authStore.user);
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
      ownerID: user.value.id,
    };

    push(ref(db, "recipes"), recipeObj)
      .then((result) => {
        console.log("[saveRecipe] Successfully saved new recipe");
        recipeKey.value = result.key;
      })
      .then(() => {
        getRecipe();
      });
  } else {
    recipeObj = recipeObj || {};

    update(ref(db, `recipes/${recipeKey}`), recipeObj)
      .then(() => {
        console.log("Successfully updated recipe:", recipeObj);
      })
      .then(() => {
        getRecipe();
      });
  }
}

async function getRecipe() {
  if (user.value) {
    try {
      const snapshot = await get(ref(db, `recipes/${recipeKey.value}`));

      if (snapshot.exists()) {
        recipe.value = snapshot.val();
      }
    } catch (error) {
      console.log("Error: Failed getting recipe:", error.message);
    }
  }
}
</script>
