<template>
  <comment
    :comment="subComment"
    :recipeKey="recipeKey"
    :maincommentKey="maincommentKey"
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
    maincommentKey: {
      type: String,
      default: ""
    }
  }
};
</script>
