<template>
  <fieldset id="freeFrom" class="categories">
    <h4 class="categories_title margin-bottom-md">Free from</h4>

    <label
      class="categories_category margin-right-lg"
      v-for="allergen in allergens"
      :key="allergen"
    >
      <input
        type="checkbox"
        :id="allergen"
        :value="allergen"
        @change="
          (event) => {
            handleFreeFrom(event.target);
          }
        "
      />
      {{ allergen }}
    </label>
  </fieldset>
</template>
<script setup>
import { onMounted } from "vue";
import { useRecipeStore } from "~/store";
const recipeStore = useRecipeStore();

const emit = defineEmits(["update"]);

const props = defineProps({
  existingFreeFrom: {
    type: Array,
    default: () => [],
  },
});

const checkedFreeFrom = ref([]);

const allergens = computed(() => {
  const allCategories = recipeStore.allCategories;
  return Object.values(
    allCategories.filter((obj) => {
      return obj.allergens;
    })[0]
  )[0];
});

function handleFreeFrom(target) {
  const categoryIndex = checkedFreeFrom.value.indexOf(target.value);
  const checked = [].concat(checkedFreeFrom.value);

  if (target.checked) {
    checked.push(target.value);
  } else if (!target.checked && categoryIndex !== -1) {
    checked.splice(categoryIndex, 1);
  }
  checkedFreeFrom.value = checked;
  emit("update", checked);
}

onMounted(() => {
  const existingFreeFrom = props.existingFreeFrom;

  if (existingFreeFrom && existingFreeFrom.length) {
    existingFreeFrom.forEach((allergen) => {
      const element = document.getElementById(allergen);
      if (element) element.checked = true;
    });
  }
  checkedFreeFrom.value = props.existingFreeFrom;
});
</script>
