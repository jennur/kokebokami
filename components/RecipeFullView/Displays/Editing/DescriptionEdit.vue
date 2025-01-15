<template>
  <textarea
    class="recipe_description recipe_description--edit"
    type="text"
    v-model="updatedDescription"
    v-click-outside="handleUpdate"
    @keydown="
      event => {
        event.keyCode === 13 && handleUpdate;
      }
    "
  ></textarea>
</template>
<script>
 

export default {
  name: "description-edit",
  props: {
    description: {
      type: String,
      default: ""
    }
  },
  data() {
    return { updatedDescription: this.description };
  },
  methods: {
    handleUpdate() {
      this.$emit("save", this.updatedDescription);
    }
  },
  
};
</script>
