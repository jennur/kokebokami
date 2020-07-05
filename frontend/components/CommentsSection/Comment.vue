<template>
  <div v-if="isRecipeOwner || commentObj.approved" class="comment">
    <button
      v-if="commentObj.isMyComment"
      class="comment__delete-btn button button--dynamic button--transparent button--transparent-red"
      @click="deleteComment"
    >✕</button>

    <!-- Approval -->
    <div
      v-if="!commentObj.approved"
      class="comment__approval margin-bottom--large"
      @click="approveComment"
    >
      <span
        class="comment__approval-text padding-vertical--medium margin-right--large"
      >Awaiting your approval</span>
      <span class="comment__approval-btn-wrap padding-vertical--medium">
        <button
          class="comment__approval-btn--delete button button--dynamic button--red-border button--round margin-right--medium"
          @click="deleteComment"
        >Delete</button>
        <button class="comment__approval-btn button button--dynamic button--round">Approve</button>
      </span>
    </div>

    <!-- Comment info -->
    <div class="flex-row flex-row--align-center">
      <div
        v-if="commentObj.photoURL"
        class="comment__user-img"
        role="img"
        :aria-label="`${username}'s profile image`"
        :style="`background-image: url(${commentObj.photoURL});`"
      ></div>

      <CookSilhouette v-else class="comment__user-img" />
      <component
        :is="isAnonymous ? 'span': 'nuxt-link'"
        :to="isAnonymous ? null : `/cooks/${commentObj.userId}/`"
        class="margin-left--medium"
        :class="{
              'no-link': isAnonymous
            }"
      >{{username}}</component>
      <span class="comment__date">{{submitDate}}</span>
    </div>

    <!-- Comment -->
    <div class="comment__comment margin-top--small">{{commentText}}</div>
    <button
      v-if="!isSubComment && !formOpen"
      class="comment__reply-btn button button--small button--dynamic button--transparent margin-top--large"
      :class="{
    'margin-bottom--large': commentObj.subComments}"
      @click="openCommentForm"
    >Reply</button>

    <!-- Subcomments -->
    <expand-transition :show="formOpen">
      <comment-form
        class="sub-comments-form margin-top--large"
        :isRecipeOwner="isRecipeOwner"
        @addComment="subCommentObj => submitSubComment(subCommentObj)"
      />
    </expand-transition>
    <transition name="fade">
      <div
        v-if="submitted"
        class="sub-comments-form__success padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >🎉Your comment was successfully added and is awaiting approval</div>
    </transition>
    <transition name="fade">
      <div
        v-if="error"
        class="sub-comments-form__error padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >🌧An error occured while posting your comment. Please try again later.</div>
    </transition>
    <div v-if="commentObj.subComments" class="comment__sub-comments">
      <sub-comment
        v-for="subComment in commentObj.subComments"
        :key="subComment[0]"
        :subComment="subComment"
        :mainCommentKey="comment[0]"
      />
    </div>
  </div>
</template>

<script>
import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import SubComment from "./SubComment.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "comment",
  components: {
    CommentForm: () => import("./CommentForm.vue"),
    CookSilhouette,
    SubComment,
    ExpandTransition
  },
  props: {
    comment: {
      type: Array,
      default: () => []
    },
    isSubComment: {
      type: Boolean,
      default: false
    },
    mainCommentKey: {
      type: String,
      default: ""
    },
    recipeKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      formOpen: false,
      submitted: false,
      error: false
    };
  },
  computed: {
    commentKey() {
      return this.comment[0];
    },
    commentObj() {
      return this.comment[1];
    },
    commentText() {
      return this.comment[1].comment;
    },
    isAnonymous() {
      return this.comment[1].isAnonymous;
    },
    username() {
      return this.comment[1].username;
    },
    submitDate() {
      return this.comment[1].submitDate;
    }
  },
  methods: {
    openCommentForm() {
      this.formOpen = true;
    },
    submitSubComment(subCommentObj) {
      let recipeKey = this.recipeKey;
      let commentKey = this.comment[0];
      let subCommentsRef = this.$fireDb.ref(
        `recipes/${recipeKey}/comments/${commentKey}/subComments`
      );
      subCommentsRef
        .push(subCommentObj)
        .then(() => {
          console.log("Subcomment was added successfully");
          this.submitted = true;
          this.formOpen = false;
          this.error = false;
        })
        .catch(error => {
          this.error = true;
          console.log("Error submitting subcomment:", error.message);
        });
    },
    approveComment() {
      let recipeKey = this.recipeKey;
      let mainCommentKey = this.mainCommentKey;
      let commentKey = this.comment[0];

      if (this.isSubComment) {
        let subCommentRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${mainCommentKey}/subComments/${commentKey}`
        );
        subCommentRef
          .update({ approved: true })
          .then(() => {
            console.log("Subcomment was updated successfully ");
            this.$emit("update");
          })
          .catch(error => {
            console.log("Error updating subcomment:", error.message);
          });
      } else {
        let commentRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${commentKey}`
        );
        commentRef
          .update({ approved: true })
          .then(() => {
            console.log("Comment was updated successfully ");
          })
          .catch(error => {
            console.log("Error updating comment:", error.message);
          });
      }
    },
    deleteComment() {
      let recipeKey = this.recipeKey;
      let mainCommentKey = this.mainCommentKey;
      let commentKey = this.comment[0];

      if (this.isSubComment) {
        let subCommentRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${mainCommentKey}/subComments/${commentKey}`
        );
      } else {
        let commentRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${commentKey}`
        );
      }
    }
  }
};
</script>
