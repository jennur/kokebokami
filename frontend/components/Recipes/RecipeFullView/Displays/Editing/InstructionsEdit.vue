<template>
  <div class="instructions">
    <ol class="drop-zone recipe__instructions">
      <li
        v-for="(instruction, index) in instructionsToBeUpdated"
        :key="instruction.id"
        class="drag-el recipe__instructions-step padding-bottom--small flex-row flex-row--align-center flex-row--nowrap"
        draggable
        @dragstart="startDrag($event, instruction, index)"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <span class="drag-el__button"></span>
        <div class="drag-el__content ">
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
        class="margin-top--large margin-right--large"
        @increment="addInstruction"
        >Add instruction</increment-button
      >
      <button
        class="button button--dynamic-small button--round padding-vertical--small margin-top--large"
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
      console.log("ID:", id);
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
