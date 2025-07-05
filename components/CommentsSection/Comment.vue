<template>
  <div v-if="isRecipeOwner || comment.approved" class="comment">
    <i-delete-icon
      tabindex="0"
      v-if="isRecipeOwner || comment.isMyComment"
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
      v-if="!comment.approved"
      class="comment_approval margin-bottom-lg"
      @click="approveComment"
    >
      <span class="comment_approval-text padding-v-md margin-right-lg">{{
        $t("comments.awaitingYourApproval")
      }}</span>
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
        v-if="comment.photoURL"
        class="comment_user-img"
        role="img"
        :aria-label="`${comment.username}'s profile image`"
        :style="`background-image: url(${comment.photoURL});`"
      ></div>

      <CookSilhouette v-else class="comment_user-img" />
      <component
        :is="isAnonymous ? 'span' : 'NuxtLink'"
        :to="isAnonymous ? null : `/cooks/${userPath}`"
        class="margin-left-md"
        :class="{
          'no-link': isAnonymous,
        }"
        >{{ comment.username }}</component
      >
      <span class="comment_date margin-left-md">{{ comment.submitDate }}</span>
    </div>

    <!-- Comment -->
    <div class="comment_comment margin-top-sm">{{ comment.comment }}</div>
    <button
      v-if="!isSubComment && !formOpen"
      class="comment_reply-btn button button-sm button--dynamic button--trans margin-top-lg"
      :class="{
        'margin-bottom-lg': comment.subComments,
      }"
      @click="openCommentForm"
    >
      {{ $t("reply") }}
    </button>

    <!-- Subcomments -->
    <ExpandTransition :show="formOpen">
      <CommentForm
        class="sub-comments-form margin-top-lg"
        :isRecipeOwner="isRecipeOwner"
        @addComment="submitSubComment"
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
        :key="subComment.key"
        :subComment="subComment"
        :parentKey="comment.key"
        :recipeKey="recipeKey"
        :isRecipeOwner="isRecipeOwner"
        @update="emit('update')"
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

<script setup>
import {
  getDatabase,
  ref as dbRef,
  update,
  remove,
  push,
} from "firebase/database";

import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import SubComment from "./SubComment.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import Alert from "~/components/Alert.vue";
import generatePath from "../../helpers/generatePath";
import { onMounted } from "vue";
import CommentForm from "./CommentForm.vue";

const { t } = useI18n();

const emit = defineEmits(["update", "subCommentSubmitted"]);

const props = defineProps({
  comment: {
    type: Object,
    default: () => {},
  },
  isSubComment: {
    type: Boolean,
    default: false,
  },
  parentKey: {
    type: String,
    default: "",
  },
  recipeKey: {
    type: String,
    default: "",
  },
  recipeOwner: {
    type: Array,
    default: () => [],
  },
  isRecipeOwner: {
    type: Boolean,
    deafult: false,
  },
});

const formOpen = ref(false);
const submitted = ref(false);
const error = ref(false);
const alertMessage = ref("");
const showAlert = ref(false);
const subComments = ref([]);
const cutOffSubComments = ref([]);

const isAnonymous = computed(() => {
  return props.comment.isAnonymous;
});

const userPath = computed(() => {
  let [userid, username] = [props.comment.userId, props.comment.username];
  return generatePath(username, userid);
});

function loadMoreSubComments() {
  subComments.value = subComments.value.concat(
    cutOffSubComments.value.splice(0, 5)
  );
}

function getSubComments() {
  if (!props.isSubComment) {
    subComments.value = props.comment.subComments || [];
    if (subComments.length > 2) {
      cutOffSubComments.value = subComments.value.splice(
        2,
        subComments.value.length - 1
      );
    }
  }
}

function confirmDelete() {
  alertMessage.value = `${t("comments.deleteAlertNote")} '${
    props.comment.comment
  }'?`;
  showAlert.value = true;
}

function closeAlert() {
  alertMessage.value = "";
  showAlert.value = false;
}

function openCommentForm() {
  formOpen.value = true;
}

function submitSubComment(subCommentObj) {
  const db = getDatabase();
  const subCommentsRef = dbRef(
    db,
    `recipes/${props.recipeKey}/comments/${props.comment.key}/subComments`
  );
  push(subCommentsRef, subCommentObj)
    .then(() => {
      console.info("[submitSubComment] Subcomment was added successfully");
      submitted.value = true;
      formOpen.value = false;
      error.value = false;

      emit("update");
    })
    .catch((error) => {
      error.value = true;
      console.error("[submitSubComment]", error.message);
    });
}

function approveComment() {
  const db = getDatabase();

  const pathEnd = props.isSubComment
    ? `${props.parentKey}/subComments/${props.comment.key}`
    : `${props.comment.key}`;

  const commentRef = dbRef(
    db,
    `recipes/${props.recipeKey}/comments/${pathEnd}`
  );

  update(commentRef, { approved: true })
    .then(() => {
      console.info(
        `[approveComment] ${
          props.isSubComment ? "Sub-comment" : "Comment"
        } was updated successfully`
      );
      emit("update");
    })
    .catch((error) => {
      console.error("[approveComment]", error.message);
    });
}

function deleteComment() {
  const db = getDatabase();

  const pathEnd = props.isSubComment
    ? `${props.parentKey}/subComments/${props.comment.key}`
    : `${props.comment.key}`;

  const commentRef = dbRef(
    db,
    `recipes/${props.recipeKey}/comments/${pathEnd}`
  );

  remove(commentRef)
    .then(() => {
      console.info(
        `[deleteComment] Successfully deleted ${
          props.isSubComment ? "sub-comment" : "comment"
        }`
      );
      emit("update");
    })
    .catch((error) => {
      console.error("[deleteComment]", error.message);
    });
}

onMounted(() => getSubComments());
</script>
