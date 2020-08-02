<template>
  <label class="switch">
    <input
      type="checkbox"
      v-model="isChecked"
      @change="$emit('toggle', isChecked)"
    />
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  name: "toggle-switch",
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isChecked: this.checked
    };
  }
};
</script>
