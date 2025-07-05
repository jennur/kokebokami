<template>
  <comment
    :recipeKey="recipeKey"
    :parentKey="parentKey"
    :comment="subComment"
    :isSubComment="true"
    :isRecipeOwner="isRecipeOwner"
    class="sub-comment padding-v-lg"
    @update="emit('update')"
  />
</template>

<script setup>
import Comment from "./Comment.vue";

const emit = defineEmits(["update"]);

const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  subComment: {
    type: Object,
    default: () => {},
  },
  parentKey: {
    type: String,
    default: "",
  },
  isRecipeOwner: {
    type: Boolean,
    deafult: false,
  },
});
</script>
