<template>
  <label class="switch">
    <input
      type="checkbox"
      v-model="isChecked"
      @change="emit('toggle', isChecked)"
    />
    <span class="slider round"></span>
  </label>
</template>

<script setup>
const emit = defineEmits(["toggle"]);
const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
});

const isChecked = ref(props.checked);
</script>
