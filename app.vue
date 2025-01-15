<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAsyncData } from "nuxt/app";
import useRecipes from "./composables/recipes";
import { useRecipeStore } from "../store/recipeStore";

const { data, error } = await useAsyncData("recipes", useRecipes);
const { recipes = [], loaded = false, errorMessage = null } = data?.value || {};
const recipeStore = useRecipeStore();
recipeStore.SET_RECIPES(recipes, loaded, errorMessage);
</script>