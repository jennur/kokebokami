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
        <span class="drag-el__button"></span>
        <div class="drag-el__content">
          <input
            class="ingredient__amount"
            type="number"
            min="0"
            step=".05"
            v-model="ingredientsToBeUpdated[index].amount"
          />
          <input
            class="ingredient__item"
            type="text"
            v-model="ingredientsToBeUpdated[index].item"
          />
        </div>
        <decrement-button
          :data-ingredient-ref="index"
          @decrement="
            event => {
              removeIngredient(index);
            }
          "
        ></decrement-button>
      </div>
    </div>
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-top--large margin-right--large"
        @increment="addIngredient"
        >Add ingredient</increment-button
      >
      <button
        class="button button--dynamic-small button--round padding-vertical-sm margin-top--large"
        @click="$emit('save', ingredientsToBeUpdated)"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import DecrementButton from "~/components/Input/DecrementButton.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

export default {
  name: "ingredients-edit",
  components: {
    DecrementButton,
    IncrementButton
  },
  props: {
    ingredients: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ingredientsToBeUpdated: [],
      moveIndex: null
    };
  },
  methods: {
    startDrag(event, item, index) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemID", item.id);
      this.moveIndex = index;
    },
    onDrop(event, index) {
      let itemID = event.dataTransfer.getData("itemID");
      let ingredient = this.ingredientsToBeUpdated.find(
        ingredient => ingredient.id == itemID
      );
      let moveIndex = this.moveIndex;
      this.ingredientsToBeUpdated.splice(moveIndex, 1);
      this.ingredientsToBeUpdated.splice(index, 0, ingredient);
    },
    removeIngredient(index) {
      this.ingredientsToBeUpdated.splice(index, 1);
    },
    addIngredient() {
      let id = Math.random() * 10;
      this.ingredientsToBeUpdated.push({ amount: 0, item: " ", id });
    }
  },
  created() {
    this.ingredientsToBeUpdated = this.ingredients;
  }
};
</script>
