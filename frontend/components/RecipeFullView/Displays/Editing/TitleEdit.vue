<template>
  <input
    class="recipe__title recipe__title--edit"
    type="text"
    v-model="updatedTitle"
    v-click-outside="handleUpdate"
    @keydown="event => { event.keyCode === 13 && handleUpdate }"
  />
</template>
<script>
import ClickOutside from "vue-click-outside";

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
  directives: {
    ClickOutside
  }
};
</script>
