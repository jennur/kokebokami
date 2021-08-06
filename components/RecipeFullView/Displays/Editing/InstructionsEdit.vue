<template>
  <div class="instructions">
    <ol class="drop-zone recipe_instructions">
      <li
        v-for="(instruction, index) in instructionsToBeUpdated"
        :key="instruction.id"
        class="drag-el recipe_instructions-step padding-bottom-sm flex-row flex-row--align-center flex-row--nowrap"
        draggable
        @dragstart="startDrag($event, instruction, index)"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <span class="drag-el_button"></span>
        <div class="drag-el_content ">
          <textarea
            class="instruction"
            type="text"
            v-model="instructionsToBeUpdated[index].content"
          />
        </div>
        <decrement-button
          :data-instruction-ref="index"
          @decrement="
            event => {
              removeInstruction(index);
            }
          "
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

<script>
import DecrementButton from "~/components/Input/DecrementButton.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";

export default {
  name: "instructions-edit",
  components: {
    DecrementButton,
    IncrementButton
  },
  props: {
    instructions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      instructionsToBeUpdated: [],
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
      let instruction = this.instructionsToBeUpdated.find(
        instruction => instruction.id == itemID
      );
      let moveIndex = this.moveIndex;
      this.instructionsToBeUpdated.splice(moveIndex, 1);
      this.instructionsToBeUpdated.splice(index, 0, instruction);
    },
    removeInstruction(index) {
      this.instructionsToBeUpdated.splice(index, 1);
    },
    addInstruction() {
      let id = Math.random() * 10;
      this.instructionsToBeUpdated.push({ content: " ", id });
    },
    handleSave() {
      let instructions = this.instructionsToBeUpdated;
      instructions = instructions.map(instruction => {
        return instruction.content;
      });
      this.$emit("save", instructions);
    }
  },
  created() {
    this.instructionsToBeUpdated = this.instructions.map(
      (instruction, index) => {
        return {
          content: instruction,
          id: index
        };
      }
    );
  }
};
</script>
