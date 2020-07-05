<template>
  <div>
    <div v-if="loading" class="flex-row flex-row--align-center">
      <span class="simple-loading-spinner"></span>
      Loading comments
    </div>
    <div
      v-if="!loading && !comments.length"
      class="comments--empty margin-vertical--xxlarge"
    >Be the first one to leave a comment!</div>

    <div v-if="!loading && comments.length" class="comments">
      <comment
        v-for="comment in comments"
        :key="comment[0]"
        :recipeKey="recipeKey"
        :comment="comment"
        :isSubComments="false"
        :isRecipeOwner="isRecipeOwner"
        class="padding-vertical--large"
        @update="getComments"
      />
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import Comment from "./Comment.vue";

export default {
  name: "comments",
  components: {
    Comment
  },
  props: {
    recipeKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { loading: false, comments: [] };
  },
  mixins: [user],
  methods: {
    getComments() {
      let componentThis = this;
      this.loading = true;
      let commentsRef = this.$fireDb.ref(`recipes/${this.recipeKey}/comments`);
      commentsRef
        .once("value", comments => {
          if (comments.exists()) {
            comments = Object.entries(comments.val());
            componentThis.comments = comments.map(comment => {
              if (comment[1].userId === componentThis.user.id) {
                comment[1].isMyComment = true;
              }
              if (comment[1].isAnonymous) {
                comment[1].username = "Anonymous";
                comment[1].photoURL = "";
              }
              if (comment[1].subComments) {
                let subComments = Object.entries(comment[1].subComments);
                comment[1].subComments = subComments.map(subComment => {
                  if (subComment[1].userId === componentThis.user.id) {
                    subComment[1].isMyComment = true;
                  }
                  if (subComment[1].isAnonymous) {
                    subComment[1].username = "Anonymous";
                    subComment[1].photoURL = "";
                  }
                  return subComment;
                });
              }
              return comment;
            });
          }
        })
        .then(() => {
          componentThis.loading = false;
          console.log("Comments:", componentThis.comments);
        })
        .catch(error => {
          componentThis.loading = false;
          console.log("Error loading comments:", error.message);
        });
    }
  },
  mounted() {
    this.getComments();
  }
};
</script>
