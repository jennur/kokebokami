<template>
  <comment
    :recipeKey="recipeKey"
    :mainCommentKey="mainCommentKey"
    :comment="subComment"
    :isSubComment="true"
    :isRecipeOwner="isRecipeOwner"
    class="sub-comment padding-v-lg"
    @update="$emit('update')"
  />
</template>

<script>
export default {
  name: "sub-comment",
  components: {
    Comment: () => import("./Comment.vue")
  },
  props: {
    recipeKey: {
      type: String,
      default: ""
    },
    subComment: {
      type: Array,
      default: () => []
    },
    mainCommentKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      deafult: false
    }
  }
};
</script>
