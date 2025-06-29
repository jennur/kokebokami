<template>
  <textarea
    class="recipe_description recipe_description--edit"
    type="text"
    v-model="updatedDescription"
    v-click-outside="handleUpdate"
    @keydown="
      (event) => {
        event.keyCode === 13 && handleUpdate;
      }
    "
  ></textarea>
</template>

<script setup>
const emit = defineEmits("save");

const props = defineProps({
  description: {
    type: String,
    default: "",
  },
});

const updatedDescription = ref(props.description);

function handleUpdate() {
  emit("save", updatedDescription.value);
}
</script>
