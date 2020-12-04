<template>
  <div>
    <div v-if="loading" class="flex-row flex-row--align-center">
      <span class="simple-loading-spinner"></span>
      {{ $t("comments.loadingComments") }}
    </div>
    <div
      v-if="!loading && !comments.length"
      class="comments--empty margin-vertical--xxlarge"
    >
      {{ $t("comments.noCommentsNote") }}
    </div>

    <div v-if="!loading && comments.length" class="comments">
      <comment
        v-for="comment in comments"
        :key="comment[0]"
        :recipeKey="recipeKey"
        :comment="comment"
        :isSubComment="false"
        :isRecipeOwner="isRecipeOwner"
        class="padding-vertical--large"
        @update="getComments"
        @subCommentSubmitted="commentObj => $emit('send-email', commentObj)"
      />
    </div>

    <button
      v-if="cutOffComments.length"
      class="comments__load-more-btn button button--transparent margin-top--large"
      @click="loadMoreComments"
    >
      {{ $t("loadMore") }}
    </button>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import Comment from "./Comment.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "comments",
  components: {
    Comment,
    ExpandTransition
  },
  props: {
    recipeKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    },
    update: {
      type: Number,
      default: 0
    }
  },
  data() {
    return { loading: false, comments: [], cutOffComments: [], updated: 0 };
  },
  watch: {
    update: function(val) {
      if (val !== this.updated) {
        this.getComments();
        this.updated = val;
      }
    }
  },
  mixins: [user],
  methods: {
    loadMoreComments() {
      let comments = this.comments;
      let cutOffComments = this.cutOffComments;
      this.comments = comments.concat(cutOffComments.splice(0, 3));
      this.cutOffComments = cutOffComments;
    },
    getComments() {
      let componentThis = this;
      this.loading = true;
      let commentsRef = this.$fire.database.ref(`recipes/${this.recipeKey}/comments`);
      commentsRef
        .once("value", comments => {
          if (comments.exists()) {
            comments = Object.entries(comments.val());
            comments = comments.map(comment => {
              //Handle comment
              if (comment[1].userId === componentThis.user.id) {
                comment[1].isMyComment = true;
              }
              if (comment[1].isAnonymous) {
                comment[1].username = "Anonymous";
                comment[1].photoURL = "";
              }

              //Handle subcomments
              if (comment[1].subComments) {
                let subComments = Object.entries(comment[1].subComments);
                comment[1].subComments = subComments.map(subComment => {
                  if (subComment[1].userId === componentThis.user.id) {
                    subComment[1].isMyComment = true;
                  }
                  if (subComment[1].isAnonymous) {
                    subComment[1].username = this.$t("anonymous");
                    subComment[1].photoURL = "";
                  }
                  return subComment;
                });
              }
              return comment;
            });
            if (comments.length > 2) {
              componentThis.cutOffComments = comments.splice(
                2,
                comments.length - 1
              );
            }
            componentThis.comments = comments;
          } else {
            componentThis.comments = [];
          }
        })
        .then(() => {
          componentThis.loading = false;
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
