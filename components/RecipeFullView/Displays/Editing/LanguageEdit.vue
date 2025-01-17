<template>
  <div v-click-outside="closeEdit">
    <SelectComponent
      id="language"
      :options="languages"
      :preSelected="language"
      defaultValue="Not set"
      @select="handleLanguage"
    />
  </div>
</template>
<script setup>
import SelectComponent from "~/components/Input/SelectComponent.vue";
import { useRecipeStore } from "~/store";
const recipeStore = useRecipeStore();

const emit = defineEmits(["update", "close"]);

const props = defineProps({
  language: {
    type: String,
    default: "",
  },
});

const languages = computed(() => {
  return recipeStore.allCategories.languages;
});

function handleLanguage(language) {
  if (language === "All languages") {
    language = null;
  }
  emit("update", language);
}
function closeEdit() {
  emit("close");
}
</script>
