<template>
  <comment
    :comment="subComment"
    :recipeKey="recipeKey"
    :mainCommentKey="mainCommentKey"
    :isSubComment="true"
    class="sub-comment padding-vertical--large"
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
    }
  }
};
</script>
