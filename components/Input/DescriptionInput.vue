<template>
  <label>
    <textarea
      class="add-recipe-form_description"
      placeholder="Say something about the recipe."
      name="description"
      v-model="description"
    ></textarea>
  </label>
</template>
<script>
const props = defineProps({
  existingDescription: {
    type: String,
    default: "",
  },
});

const description = ref(props.existingDescription || "");
</script>
