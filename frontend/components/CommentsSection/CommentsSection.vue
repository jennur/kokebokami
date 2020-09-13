<template>
  <div class="comments-section margin-bottom--xxlarge">
    <div class="comments-section__headline">
      <h3 class="margin-top--xxlarge margin-bottom--medium">
        {{ $t("comments.headline") }}
      </h3>
    </div>
    <comment-form
      class="margin-bottom--xlarge"
      @addComment="commentObj => submitComment(commentObj)"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :submitted="submitted"
      :error="error"
    />
    <comments
      :recipeKey="recipeKey"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :update="updateComments"
    />
  </div>
</template>

<script>
import user from "~/mixins/user.js";

import CommentForm from "./CommentForm.vue";
import Comments from "./Comments.vue";

export default {
  name: "comments-section",
  components: {
    CommentForm,
    Comments
  },
  props: {
    recipeKey: {
      type: String,
      default: ""
    },
    recipeOwnerID: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      submitted: false,
      error: false,
      updateComments: 0
    };
  },
  mixins: [user],
  methods: {
    submitComment(commentObj) {
      let recipeKey = this.recipeKey;
      let commentsRef = this.$fireDb.ref(`recipes/${recipeKey}/comments`);
      commentsRef
        .push(commentObj)
        .then(() => {
          this.submitted = true;
          this.error = false;
          this.updateComments++;
        })
        .catch(error => {
          this.error = true;
          console.log("Error submitting comment:", error.message);
        });
    }
  }
};
</script>
