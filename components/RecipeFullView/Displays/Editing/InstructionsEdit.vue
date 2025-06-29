<template>
  <div class="instructions">
    <ol class="drop-zone recipe_instructions">
      <li
        v-for="(instruction, index) in instructionsToBeUpdated"
        :key="instruction.id"
        class="drag-el recipe_instructions-step padding-bottom-sm flex-row flex-row--align-center flex-row--nowrap"
        draggable
        @dragstart="(event) => startDrag(event, instruction, index)"
        @drop="(event) => onDrop(event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <span class="drag-el_button"></span>
        <div class="drag-el_content">
          <textarea
            class="instruction"
            type="text"
            v-model="instructionsToBeUpdated[index].content"
          ></textarea>
        </div>
        <decrement-button
          :data-instruction-ref="index"
          @decrement="() => removeInstruction(index)"
        ></decrement-button>
      </li>
    </ol>
    <div class="flex-row flex-row--align-center">
      <increment-button
        class="margin-top-lg margin-right-lg"
        @increment="addInstruction"
        >Add instruction</increment-button
      >
      <button
        class="button button--dynamic-small button--round padding-v-sm margin-top-lg"
        @click="handleSave"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

const emit = defineEmits(["save"]);
const props = defineProps({
  instructions: {
    type: Array,
    default: () => [],
  },
});

const instructionsToBeUpdated = ref([]);
const moveIndex = ref(null);

function startDrag(event, item, index) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item.id);
  moveIndex.value = index;
}

function onDrop(event, index) {
  let itemID = event.dataTransfer.getData("itemID");
  let instruction = instructionsToBeUpdated.value.find(
    (instruction) => instruction.id == itemID
  );
  instructionsToBeUpdated.value.splice(moveIndex.value, 1);
  instructionsToBeUpdated.value.splice(index, 0, instruction);
}

function removeInstruction(index) {
  instructionsToBeUpdated.value.splice(index, 1);
}

function addInstruction() {
  let id = Math.random() * 10;
  instructionsToBeUpdated.value.push({ content: " ", id });
}

function handleSave() {
  let instructions = instructionsToBeUpdated.value;
  instructions = instructions.map((instruction) => {
    return instruction.content;
  });
  emit("save", instructions);
}

onMounted(() => {
  instructionsToBeUpdated.value = props.instructions.map(
    (instruction, index) => {
      return {
        content: instruction,
        id: index,
      };
    }
  );
});
</script>
