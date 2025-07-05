<template>
  <div>
    <div v-if="loading" class="flex-row flex-row--align-center">
      <span class="simple-loading-spinner"></span>
      {{ $t("comments.loadingComments") }}
    </div>
    <div
      v-if="!loading && !parsedComments.length"
      class="comments--empty margin-v-2xl"
    >
      {{ $t("comments.noCommentsNote") }}
    </div>

    <div v-if="!loading && parsedComments.length" class="comments">
      <Comment
        v-for="comment in parsedComments"
        :key="comment.key"
        :recipeKey="recipeKey"
        :comment="comment"
        :isSubComment="false"
        :isRecipeOwner="isRecipeOwner"
        class="padding-v-lg"
        @update="getComments"
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
import { getDatabase, ref as dbRef, get } from "firebase/database";
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
  comments: {
    type: Object,
    default: () => {},
  },
});

const loading = ref(false);
const parsedComments = ref(parseComments(props.comments));
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
  parsedComments.value = parsedComments.value.concat(
    cutOffComments.value.splice(0, 3)
  );
}

function parseComments(items) {
  const parsed = [];

  for (const key in items) {
    const comment = parseCommentObj(key, items[key]);
    const subComments = items[key].subComments;

    if (subComments) {
      const parsedSubComments = [];
      for (const subKey in subComments) {
        parsedSubComments.push(parseCommentObj(subKey, subComments[subKey]));
      }
      comment.subComments = parsedSubComments;
    }
    parsed.push(comment);
  }
  return parsed;
}

function parseCommentObj(key, comment) {
  return {
    ...comment,
    key,
    username: comment.isAnonymous ? t("anonymous") : comment.username,
    photoURL: comment.isAnonymous ? "" : comment.photoURL,
    isMyComment: comment.userId === user.value.id,
    submitDate: getDateString(comment.submitDate.replace(/"/g, "")),
  };
}

async function getComments() {
  loading.value = true;
  try {
    const db = getDatabase();
    const snapshot = await get(
      dbRef(db, `recipes/${props.recipeKey}/comments`)
    );
    if (snapshot.exists()) {
      const dbComments = parseComments(snapshot.val());

      if (dbComments.length > 2) {
        cutOffComments.value = dbComments.splice(2, dbComments.length - 1);
      }

      parsedComments.value = dbComments;
    } else {
      parsedComments.value = [];
    }
  } catch (error) {
    console.error("[getComments]", error.message);
  } finally {
    loading.value = false;
  }
}
</script>
