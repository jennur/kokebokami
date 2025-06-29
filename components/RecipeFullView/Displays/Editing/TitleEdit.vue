<template>
  <input
    class="recipe_title recipe_title--edit"
    type="text"
    v-model="updatedTitle"
    v-click-outside="handleUpdate"
    @keydown="
      (event) => {
        event.keyCode === 13 && handleUpdate;
      }
    "
  />
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["save"]);
const updatedTitle = ref(props.title);

function handleUpdate() {
  emit("save", updatedTitle.value);
}
</script>
