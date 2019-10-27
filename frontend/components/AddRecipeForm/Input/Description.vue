<template>
  <label>
    <textarea
      class="add-recipe-form__description"
      placeholder="Say something about the recipe."
      name="description"
      v-model="description"
    />
  </label>
</template>
<script>
export default {
  name: "description",
  data() {
    let descriptionValue = "";
    if (this.existingDescription) {
      descriptionValue = this.existingDescription;
    }
    return { description: descriptionValue };
  },
  props: {
    existingDescription: {
      type: String,
      default: ""
    }
  }
};
</script>
