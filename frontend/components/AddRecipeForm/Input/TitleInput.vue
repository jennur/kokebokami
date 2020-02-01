<template>
  <label>
    <input
      class="add-recipe-form__title"
      type="text"
      placeholder="Give your recipe a title"
      v-model="title"
    />
  </label>
</template>

<script>
export default {
  name: "title-input",
  data() {
    let titleValue = "";
    if (this.existingTitle) {
      titleValue = this.existingTitle;
    }
    return { title: titleValue };
  },
  props: {
    existingTitle: {
      type: String,
      default: ""
    }
  }
};
</script>
