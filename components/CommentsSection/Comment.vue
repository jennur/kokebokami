<template>
  <div v-if="isRecipeOwner || commentObj.approved" class="comment">
    <DeleteIcon
      tabindex="0"
      v-if="isRecipeOwner || commentObj.isMyComment"
      class="comment_delete-btn icon"
      @click="confirmDelete"
    />
    <Alert
      :alertMessage="alertMessage"
      :showAlert="showAlert"
      @confirmed="deleteComment"
      @cancel="closeAlert"
    />
    <!-- Approval -->
    <div
      v-if="!commentObj.approved"
      class="comment_approval margin-bottom-lg"
      @click="approveComment"
    >
      <span
        class="comment_approval-text padding-v-md margin-right-lg"
        >{{ $t("comments.awaitingYourApproval") }}</span
      >
      <span class="comment_approval-btn-wrap padding-v-md">
        <button
          class="comment_approval-btn button button--dynamic button--round"
        >
          {{ $t("approve") }}
        </button>
      </span>
    </div>

    <!-- Comment info -->
    <div class="flex-row flex-row--align-center">
      <div
        v-if="commentObj.photoURL"
        class="comment_user-img"
        role="img"
        :aria-label="`${commentObj.username}'s profile image`"
        :style="`background-image: url(${commentObj.photoURL});`"
      ></div>

      <CookSilhouette v-else class="comment_user-img" />
      <component
        :is="isAnonymous ? 'span' : 'NuxtLink'"
        :to="isAnonymous ? null : `/cooks/${userPath}`"
        class="margin-left-md"
        :class="{
          'no-link': isAnonymous
        }"
        >{{ commentObj.username }}</component
      >
      <span class="comment_date margin-left-md">{{ commentObj.submitDate }}</span>
    </div>

    <!-- Comment -->
    <div class="comment_comment margin-top-sm">{{ commentObj.comment }}</div>
    <button
      v-if="!isSubComment && !formOpen"
      class="comment_reply-btn button button-sm button--dynamic button--trans margin-top-lg"
      :class="{
        'margin-bottom-lg': commentObj.subComments
      }"
      @click="openCommentForm"
    >
      {{ $t("reply") }}
    </button>

    <!-- Subcomments -->
    <ExpandTransition :show="formOpen">
      <comment-form
        class="sub-comments-form margin-top-lg"
        :isRecipeOwner="isRecipeOwner"
        @addComment="subCommentObj => submitSubComment(subCommentObj)"
      />
    </ExpandTransition>
    <transition name="fade">
      <div
        v-if="submitted && !isRecipeOwner"
        class="sub-comments-form_success padding-v-md padding-h-lg margin-v-lg"
      >
        🎉{{ $t("comments.awaitingApproval") }}
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="error"
        class="sub-comments-form_error padding-v-md padding-h-lg margin-v-lg"
      >
        🌧{{ $t("comments.errorSubmitting") }}
      </div>
    </transition>
    <div v-if="subComments.length" class="comment_sub-comments">
      <SubComment
        v-for="subComment in subComments"
        :key="subComment[0]"
        :subComment="subComment"
        :mainCommentKey="comment[0]"
        :recipeKey="recipeKey"
        :isRecipeOwner="isRecipeOwner"
        @update="$emit('update')"
      />
      <button
        v-if="cutOffSubComments.length"
        class="button button--trans margin-top-lg"
        @click="loadMoreSubComments"
      >
        {{ $t("loadMore") }}
      </button>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import SubComment from "./SubComment.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import Alert from "~/components/Alert.vue";
import generatePath from "../../helpers/generatePath";

export default {
  name: "comment",
  components: {
    CommentForm: () => import("./CommentForm.vue"),
    CookSilhouette,
    SubComment,
    ExpandTransition,
    Alert
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
    recipeOwner: {
      type: Array,
      default: () => []
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
      error: false,
      alertMessage: "",
      showAlert: false,
      subComments: [],
      cutOffSubComments: []
    };
  },
  computed: {
    commentKey() {
      return this.comment[0];
    },
    commentObj() {
      return this.comment[1];
    },
    isAnonymous() {
      return this.comment[1].isAnonymous;
    },
    userPath(){
      let [userid, username] = [this.commentObj.userId, this.commentObj.username];
      return generatePath(username, userid);
    }
  },
  methods: {
    loadMoreSubComments() {
      let subComments = this.subComments;
      let cutOffSubComments = this.cutOffSubComments;
      this.subComments = subComments.concat(cutOffSubComments.splice(0, 5));
      this.cutOffSubComments = cutOffSubComments;
    },
    getSubComments() {
      if (!this.isSubComment) {
        let subComments = this.commentObj.subComments || [];
        if (subComments.length > 2) {
          this.cutOffSubComments = subComments.splice(2, subComments.length - 1);
        }
        this.subComments = subComments;
      }
    },
    confirmDelete() {
      this.alertMessage = `${this.$t("comments.deleteAlertNote")} '${this.commentObj.comment}'?`;
      this.showAlert = true;
    },
    closeAlert() {
      this.alertMessage = "";
      this.showAlert = false;
    },
    openCommentForm() {
      this.formOpen = true;
    },
    submitSubComment(subCommentObj) {
      const db = getDatabase();
      let recipeKey = this.recipeKey;
      let commentKey = this.comment[0];
      let subCommentsRef = ref(db, 
        `recipes/${recipeKey}/comments/${commentKey}/subComments`
      );
      subCommentsRef
        .push(subCommentObj)
        .then(() => {
          console.log("Subcomment was added successfully");
          this.submitted = true;
          this.formOpen = false;
          this.error = false;
          if (this.isRecipeOwner) {
            this.$emit("update");
          } else {
            this.$emit("subCommentSubmitted", subCommentObj);
          }
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
        const db = getDatabase();
        let subCommentRef = ref(db, 
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
        const db = getDatabase();
        let commentRef = ref(db, 
          `recipes/${recipeKey}/comments/${commentKey}`
        );
        commentRef
          .update({ approved: true })
          .then(() => {
            console.log("Comment was updated successfully ");
            this.$emit("update");
          })
          .catch(error => {
            console.log("Error updating comment:", error.message);
          });
      }
    },
    deleteComment() {
      let componentThis = this;
      let recipeKey = this.recipeKey;
      let mainCommentKey = this.mainCommentKey;
      let commentKey = this.comment[0];

      if (this.isSubComment) {
        const db = getDatabase();
        let subCommentRef = ref(db, 
          `recipes/${recipeKey}/comments/${mainCommentKey}/subComments/${commentKey}`
        );
        subCommentRef
          .remove()
          .then(() => {
            console.log("Successfully deleted subComment");
            componentThis.$emit("update");
          })
          .catch(error => {
            console.log("Error deleting comment:", error.message);
          });
      } else {
        const db = getDatabase();
        let commentRef = ref(db, 
          `recipes/${recipeKey}/comments/${commentKey}`
        );
        commentRef
          .remove()
          .then(() => {
            console.log("Successfully deleted comment");
            componentThis.$emit("update");
          })
          .catch(error => {
            console.log("Error deleting comment:", error.message);
          });
      }
    }
  },
  mounted() {
    this.getSubComments();
  }
};
</script>
