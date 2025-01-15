<template>
  <input
    class="recipe_title recipe_title--edit"
    type="text"
    v-model="updatedTitle"
    v-click-outside="handleUpdate"
    @keydown="event => { event.keyCode === 13 && handleUpdate }"
  />
</template>
<script>
 

export default {
  name: "title-edit",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return { updatedTitle: this.title };
  },
  methods: {
    handleUpdate() {
      this.$emit("save", this.updatedTitle);
    }
  },
  
};
</script>
