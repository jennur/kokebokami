<template>
  <fieldset id="typeOfMeal" class="categories">
    <h4 class="categories_title margin-bottom-md">Type of meal</h4>
    <label
      class="categories_category margin-right-lg"
      v-for="typeOfMeal in allTypesOfMeal"
      :key="typeOfMeal"
    >
      <input
        type="checkbox"
        :value="typeOfMeal"
        :id="typeOfMeal"
        @change="
          (event) => {
            handleTypeOfMeal(event.target);
          }
        "
      />
      {{ typeOfMeal }}
    </label>
  </fieldset>
</template>
<script setup>
import { onMounted } from "vue";
import { useRecipeStore } from "~/store";
const recipeStore = useRecipeStore();

const emit = defineEmits(["update"]);
const typeOfMeal = ref([]);

const props = defineProps({
  existingTypeOfMeal: {
    type: Array,
    default: () => [],
  },
});

const allTypesOfMeal = computed(() => {
  const allCategories = recipeStore.allCategories;
  return Object.values(
    allCategories.filter((object) => {
      return object.typeOfMeal;
    })[0]
  )[0];
});

function handleTypeOfMeal(target) {
  const typeOfMeal = typeOfMeal.value;
  const categoryIndex = typeOfMeal.indexOf(target.value);

  if (target.checked) {
    typeOfMeal.push(target.value);
  } else if (!target.checked && categoryIndex !== -1) {
    typeOfMeal.splice(categoryIndex, 1);
  }
  typeOfMeal.value = typeOfMeal;
  emit("update", typeOfMeal.value);
}

onMounted(() => {
  const existingTypeOfMeal = props.existingTypeOfMeal;

  if (existingTypeOfMeal && existingTypeOfMeal.length) {
    existingTypeOfMeal.forEach((type) => {
      const element = document.getElementById(type);
      if (element) element.checked = true;
    });
    checkedTypeOfMeal.value = existingTypeOfMeal;
  }
});
</script>
