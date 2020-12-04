<template>
  <div v-if="isRecipeOwner || commentObj.approved" class="comment">
    <delete-icon
      tabindex="0"
      v-if="isRecipeOwner || commentObj.isMyComment"
      class="comment__delete-btn icon"
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
      class="comment__approval margin-bottom--large"
      @click="approveComment"
    >
      <span
        class="comment__approval-text padding-vertical--medium margin-right--large"
        >{{ $t("comments.awaitingYourApproval") }}</span
      >
      <span class="comment__approval-btn-wrap padding-vertical--medium">
        <button
          class="comment__approval-btn button button--dynamic button--round"
        >
          {{ $t("approve") }}
        </button>
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
        :is="isAnonymous ? 'span' : 'nuxt-link'"
        :to="isAnonymous ? null : `/cooks/${commentObj.userId}/`"
        class="margin-left--medium"
        :class="{
          'no-link': isAnonymous
        }"
        >{{ username }}</component
      >
      <span class="comment__date margin-left--medium">{{ submitDate }}</span>
    </div>

    <!-- Comment -->
    <div class="comment__comment margin-top--small">{{ commentText }}</div>
    <button
      v-if="!isSubComment && !formOpen"
      class="comment__reply-btn button button--small button--dynamic button--transparent margin-top--large"
      :class="{
        'margin-bottom--large': commentObj.subComments
      }"
      @click="openCommentForm"
    >
      {{ $t("reply") }}
    </button>

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
        v-if="submitted && !isRecipeOwner"
        class="sub-comments-form__success padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >
        🎉{{ $t("comments.awaitingApproval") }}
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="error"
        class="sub-comments-form__error padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >
        🌧{{ $t("comments.errorSubmitting") }}
      </div>
    </transition>
    <div v-if="subComments.length" class="comment__sub-comments">
      <sub-comment
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
        class="button button--transparent margin-top--large"
        @click="loadMoreSubComments"
      >
        {{ $t("loadMore") }}
      </button>
    </div>
  </div>
</template>

<script>
import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import SubComment from "./SubComment.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import Alert from "~/components/Alert.vue";

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
      let date = this.comment[1].submitDate;
      let dateString = date.replace(/[A-Z\"]/g, " ");
      let formattedDate = dateString.substring(0, dateString.length - 9);
      let year = formattedDate.slice(0, 5);
      let month = formattedDate.slice(6, 8);
      let day = formattedDate.slice(9, 11);
      let time = formattedDate.slice(12, 17);
      month = this.getMonthString(month);
      return `${day} ${month} ${year} ${time}`;
    }
  },
  methods: {
    getMonthString(num) {
      let month = "";
      switch (num) {
        case "01":
          month = "Jan";
          break;
        case "02":
          month = "Feb";
          break;
        case "03":
          month = "Mar";
          break;
        case "04":
          month = "Apr";
          break;
        case "05":
          month = "May";
          break;
        case "06":
          month = "Jun";
          break;
        case "07":
          month = "Jul";
          break;
        case "08":
          month = "Aug";
          break;
        case "09":
          month = "Sep";
          break;
        case "10":
          month = "Oct";
          break;
        case "11":
          month = "Nov";
          break;
        case "12":
          month = "Dec";
          break;
      }
      return month;
    },
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
          this.cutOffSubComments = subComments.splice(
            2,
            subComments.length - 1
          );
        }
        this.subComments = subComments;
      }
    },
    confirmDelete() {
      this.alertMessage = `${this.$t("comments.deleteAlertNote")} '${
        this.commentObj.comment
      }'?`;
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
      let recipeKey = this.recipeKey;
      let commentKey = this.comment[0];
      let subCommentsRef = this.$fire.database.ref(
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
        let subCommentRef = this.$fire.database.ref(
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
        let commentRef = this.$fire.database.ref(
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
        let subCommentRef = this.$fire.database.ref(
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
        let commentRef = this.$fire.database.ref(
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
