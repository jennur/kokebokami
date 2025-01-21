<template>
  <div>
    <NuxtLayout>
      <NuxtPage :page-key="route => $localePath(route.fullPath)"/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAsyncData } from "nuxt/app";
import useRecipes from "./composables/recipes";
import { useRecipeStore } from "~/store";

const recipeStore = useRecipeStore();

const { data, error } = await useAsyncData("recipes", useRecipes);
const { recipes = [], loaded = false, errorMessage = null } = data?.value || {};

recipeStore.SET_RECIPES(recipes, loaded, errorMessage);
</script>