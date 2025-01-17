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
      <Comment
        v-for="comment in comments"
        :key="comment[0]"
        :recipeKey="recipeKey"
        :comment="comment"
        :isSubComment="false"
        :isRecipeOwner="isRecipeOwner"
        class="padding-v-lg"
        @update="getComments"
        @subCommentSubmitted="(commentObj) => $emit('send-email', commentObj)"
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

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import { useAuthStore } from "~/store";
import getDateString from "~/helpers/get-date-string";
import Comment from "./Comment.vue";

const { t } = useI18n();

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
  update: {
    type: Number,
    default: 0,
  },
});

const loading = ref(false);
const comments = ref([]);
const cutOffComments = ref([]);
const updated = ref(0);

const { update } = toRefs(props);

watch(update, (value) => {
  if (value !== updated.value) {
    getComments();
    updated.value = value;
  }
});

function loadMoreComments() {
  comments.value = comments.value.concat(cutOffComments.value.splice(0, 3));
}

async function getComments() {
  loading.value = true;
  try {
    const db = getDatabase();
    const snapshot = await get(ref(db, `recipes/${props.recipeKey}/comments`));
    if (snapshot.exists()) {
      const dbComments = Object.entries(snapshot.val()).map((comment) => {
        //Handle comment
        comment[1] = createCommentObj(comment[1]);

        //Handle subcomments
        if (comment[1].subComments) {
          const subComments = Object.entries(comment[1].subComments);
          comment[1].subComments = subComments.map((subComment) => {
            subComment[1] = createCommentObj(subComment[1]);
            return subComment;
          });
        }
        return comment;
      });
      if (dbComments.length > 2) {
        cutOffComments.value = dbComments.splice(2, dbComments.length - 1);
      }
      comments.value = dbComments;
    } else {
      comments.value = [];
    }
  } catch (error) {
    console.log("[getComments]", error.message);
  }
  loading.value = false;
}

function createCommentObj(comment) {
  comment.isMyComment = comment.userId === user.value.id;

  if (comment.isAnonymous) {
    comment.username = t("anonymous");
    comment.photoURL = "";
  }

  const submitDate = comment.submitDate.replace(/"/g, "");
  comment.submitDate = getDateString(submitDate);
  return comment;
}
</script>
