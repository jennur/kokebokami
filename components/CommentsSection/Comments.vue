<template>
  <div>
    <div v-if="loading" class="flex-row flex-row--align-center">
      <span class="simple-loading-spinner"></span>
      {{ $t("comments.loadingComments") }}
    </div>
    <div
      v-if="!loading && !comments.length"
      class="comments--empty margin-v-2xl"
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
        class="padding-v-lg"
        @update="getComments"
        @subCommentSubmitted="commentObj => $emit('send-email', commentObj)"
      />
    </div>

    <button
      v-if="cutOffComments.length"
      class="comments_load-more-btn button button--trans margin-top-lg"
      @click="loadMoreComments"
    >
      {{ $t("loadMore") }}
    </button>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

import getDateString from "~/helpers/get-date-string";
import user from "~/composables/user.js";
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
      const db = getDatabase();
      let commentsRef = ref(db, `recipes/${this.recipeKey}/comments`);
      commentsRef
        .once("value", comments => {
          if (comments.exists()) {
            comments = Object.entries(comments.val());
            comments = comments.map(comment => {
              //Handle comment
              comment[1] = this.createCommentObj(comment[1]);

              //Handle subcomments
              if (comment[1].subComments) {
                let subComments = Object.entries(comment[1].subComments);
                comment[1].subComments = subComments.map(subComment => {
                  subComment[1] = this.createCommentObj(subComment[1]);
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
    },
    createCommentObj(comment) {
      comment.isMyComment = comment.userId === this.user.id;

      if (comment.isAnonymous) {
        comment.username = this.$t("anonymous");
        comment.photoURL = "";
      }

      let submitDate = comment.submitDate.replace(/"/g, '');
      comment.submitDate = getDateString(submitDate);
      return comment;
    }
  },
  mounted() {
    this.getComments();
  }
};
</script>
