<template>
  <div class="comment">
    <button
      v-if="commentObj.isMyComment"
      class="comment__delete-btn button button--dynamic button--transparent button--transparent-red"
      @click="deleteComment"
    >✕</button>
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
    maincommentKey: {
      type: String,
      default: ""
    },
    recipeKey: {
      type: String,
      default: ""
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
    deleteComment() {
      let recipeKey = this.recipeKey;
      let commentKey = this.comment[0];

      if (this.isSubComment) {
        let subCommentsRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${this.maincommentKey}/subComments/${this.comment[0]}`
        );
      } else {
        let subCommentsRef = this.$fireDb.ref(
          `recipes/${recipeKey}/comments/${commentKey}`
        );
      }
    }
  }
};
</script>
