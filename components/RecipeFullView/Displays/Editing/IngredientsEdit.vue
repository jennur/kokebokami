<template>
  <div class="ingredients">
    <div class="drop-zone drop-zone--ingredients">
      <div
        v-for="(ingredient, index) in ingredientsToBeUpdated"
        :key="ingredient.id"
        class="drag-el flex-row flex-row--align-center flex-row--nowrap"
        draggable
        @dragstart="startDrag($event, ingredient, index)"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <span class="drag-el_button"></span>
        <div class="drag-el_content">
          <input
            class="ingredient_amount"
            type="number"
            min="0"
            step=".05"
            v-model="ingredientsToBeUpdated[index].amount"
          />
          <input
            class="ingredient_item"
            type="text"
            v-model="ingredientsToBeUpdated[index].item"
          />
        </div>
        <decrement-button
          :data-ingredient-ref="index"
          @decrement="(event) => removeIngredient(event, index)"
        ></decrement-button>
      </div>
    </div>
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-top-lg margin-right-lg"
        @increment="(event) => addIngredient(event)"
        >Add ingredient</increment-button
      >
      <button
        class="button button--dynamic-small button--round padding-v-sm margin-top-lg"
        @click="(event) => handleClick(event)"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import DecrementButton from "~/components/Input/DecrementButton.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

const emit = defineEmits(["save"]);
const props = defineProps({
  ingredients: {
    type: Array,
    default: () => [],
  },
});

const ingredientsToBeUpdated = ref(props.ingredients);
const moveIndex = ref(null);

function handleClick(event) {
  event && event.stopPropagation();
  emit("save", ingredientsToBeUpdated.value);
}

function startDrag(event, item, index) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item.id);
  moveIndex.value = index;
}

function onDrop(event, index) {
  const itemID = event.dataTransfer.getData("itemID");
  const ingredient = ingredientsToBeUpdated.value.find(
    (ingredient) => ingredient.id == itemID
  );
  ingredientsToBeUpdated.value.splice(moveIndex.value, 1);
  ingredientsToBeUpdated.value.splice(index, 0, ingredient);
}

function removeIngredient(event, index) {
  event && event.stopPropagation();
  ingredientsToBeUpdated.value.splice(index, 1);
}

function addIngredient(event) {
  event && event.stopPropagation();
  const id = Math.random() * 10;
  ingredientsToBeUpdated.value.push({ amount: 0, item: " ", id });
}
</script>
