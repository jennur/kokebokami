<template>
  <fieldset id="instructionList" class="flex-column margin-vertical-2xl">
    <h4>Instructions</h4>
    <ol class="add-recipe-form_instructions">
      <li
        class="margin-bottom-md"
        v-for="number in instructionNumbers"
        :key="number"
      >
        <span class="flex-row flex-row--nowrap flex-row--align-center">
          <label>
            <textarea
              :id="'instruction' + number"
              class="add-recipe-form_instruction"
              placeholder="Explain what to do"
              v-model="instructions[number]"
            />
          </label>
          <decrement-button
            :data-instruction-ref="number"
            @decrement="event => removeInstruction(event.target)"
          ></decrement-button>
        </span>
      </li>
    </ol>
    <increment-button
      :class="
        `margin-top-lg ${
          instructionNumbers.length ? 'margin-left-2xl' : ''
        }`
      "
      @increment="incrementInstructionNumber"
      >Add step</increment-button
    >
  </fieldset>
</template>

<script>
import IncrementButton from "./IncrementButton.vue";
import DecrementButton from "./DecrementButton.vue";

export default {
  name: "instructions-input",
  components: {
    IncrementButton,
    DecrementButton
  },
  data() {
    return { instructions: [], editing: false };
  },
  props: {
    existingInstructions: {
      type: Array,
      default: () => []
    },
    instructionNumbers: { type: Array, default: () => [] }
  },
  methods: {
    incrementInstructionNumber() {
      let numbers = this.instructionNumbers;
      let instructionNumber =
        numbers.length === 0 ? 1 : Math.max.apply(null, numbers);
      this.instructionNumbers.push(instructionNumber + 1);
      this.editing = true;
    },
    removeInstruction(target) {
      let instructionNumber = target.getAttribute("data-instruction-ref");
      this.instructionNumbers.splice(
        this.instructionNumbers.indexOf(parseInt(instructionNumber)),
        1
      );
      this.editing = true;
    }
  },
  mounted() {
    let counter = 0;

    if (this.existingInstructions !== undefined) {
      this.existingInstructions.forEach(instruction => {
        this.instructionNumbers.push(counter++);
        this.instructions.push(instruction);
      });
    }
  }
};
</script>
