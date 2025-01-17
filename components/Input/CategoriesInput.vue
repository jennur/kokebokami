<template>
  <fieldset id="categories" class="categories">
    <h4 class="categories_title margin-bottom-md">Categories</h4>

    <label
      class="categories_category margin-right-lg"
      v-for="category in categories"
      :key="category"
    >
      <input
        tabindex="0"
        type="checkbox"
        :id="category"
        :value="category"
        @change="(event) => handleCategory(event.target)"
      />
      {{ category }}
    </label>
  </fieldset>
</template>

<script setup>
//Categories, FreeFrom, TypeOfMeal can be merged to one component
import { onMounted } from "vue";
import { useRecipeStore } from "~/store";
const recipeStore = useRecipeStore();

const emit = defineEmits(["update"])
const props = defineProps({
  existingCategories: {
    type: Array,
    default: () => [],
  },
});

const checkedCategories = ref([]);

const allCategories = computed(() => {
  return recipeStore.allCategories;
});
const categories = computed(() => {
  return Object.values(
    allCategories.value.filter((obj) => {
      return obj.categories;
    })[0]
  )[0];
});

const allTypesOfMeal = computed(() => {
  // Needed due to duplicate in previous categories
  return Object.values(
    allCategories.value.filter((obj) => {
      return obj.typeOfMeal;
    })[0]
  )[0];
});

function handleCategory(target) {
  const checked = [].concat(checkedCategories.value);
  const categoryIndex = checked.indexOf(target.value);

  if (target.checked) {
    checked.push(target.value);
  } else if (!target.checked && categoryIndex !== -1) {
    checked.splice(categoryIndex, 1);
  }

  checkedCategories.value = checked;

  emit("update", checked);
}

onMounted(() => {
  const existingCategories = props.existingCategories;
  if (existingCategories && existingCategories.length) {
    existingCategories.forEach((category) => {
      if (allTypesOfMeal.value.indexOf(category) === -1) {
        // ^ Needed due to duplicate of typeOfMeal in previous categories
        const element = document.getElementById(category);
        if (element) element.checked = true;
      }
    });
    checkedCategories.value = props.existingCategories;
  }
});
</script>
