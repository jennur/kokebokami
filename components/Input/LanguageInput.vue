<template>
  <fieldset class="language-input">
    <select-component
      id="language"
      :naked="naked"
      :options="languages"
      :preSelected="existingLanguage"
      defaultValue="All languages"
      @select="(language) => $emit('selected', language)"
    />
  </fieldset>
</template>
<script setup>
import SelectComponent from "./SelectComponent.vue";
import { useRecipeStore } from "../../store";

const recipeStore = useRecipeStore();

const props = defineProps({
  existingLanguage: {
    type: String,
    default: "",
  },
  naked: {
    type: Boolean,
    default: false,
  },
});
const languages = computed(() => recipeStore.allCategories.languages);
</script>
