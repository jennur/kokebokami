<template>
  <label>
    <textarea
      class="add-recipe-form__instruction"
      placeholder="Explain what to do"
      v-model="instruction"
    />
  </label>
</template>

<script>
export default {
  name: "instruction",
  data() {
    let instructionValue = "";
    if (this.existingInstruction !== "") {
      instructionValue = this.existingInstruction;
    }
    return { instruction: instructionValue };
  },
  props: {
    existingInstruction: {
      type: String,
      default: ""
    }
  }
};
</script>
