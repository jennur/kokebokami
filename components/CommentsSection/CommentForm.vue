<template>
  <div class="comment-form-wrap">
    <form v-if="user && user.id" class="comment-form">
      <div class="flex-row flex-row--align-center position-relative">
        <span class="simple-loading-spinner"></span>
        <div
          v-if="!anonymous && user.photoURL"
          class="comment_user-img"
          role="img"
          :aria-label="`${user.displayName}'s profile image`"
          :style="`background-image: url(${user.photoURL});`"
        ></div>
        <CookSilhouette v-else class="comment_user-img" />
        <span class="margin-left-md">{{
          anonymous ? $t("anonymous") : user.displayName
        }}</span>
      </div>
      <label
        class="comment-form_anonymous flex-row flex-row--align-center margin-v-lg"
      >
        <input type="checkbox" v-model="anonymous" />
        <span class="margin-left-sm">{{
          $t("comments.iWantToBeAnonymous")
        }}</span>
      </label>
      <label>
        <textarea
          class="comment-form_comment"
          :placeholder="`${$t('comments.yourComment')}...`"
          tabindex="0"
          v-model="comment"
        ></textarea>
      </label>
      <label class="comment-form_submit-wrap margin-top-md">
        <button
          type="submit"
          class="button button-sm"
          @click.prevent="handleSubmit"
        >
          {{ $t("submit") }}
        </button>
      </label>
    </form>

    <section v-else class="comment-form">
      <button
        class="button button-sm button--green margin-right-sm"
        @click="
          mainStore.SHOW_LOGIN_MODAL({
            open: true,
            headline: 'Log in to comment on this recipe',
          })
        "
      >
        {{ $t("loginText") }}
      </button>
      {{ $t("comments.loginNote") }}
    </section>

    <transition name="fade">
      <div
        v-if="submitted && !isRecipeOwner"
        class="comment-form_success padding-v-md padding-h-lg margin-v-lg"
      >
        🎉{{ $t("comments.awaitingApproval") }}
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="error"
        class="comment-form_error padding-v-md padding-h-lg margin-v-lg"
      >
        🌧{{ $t("comments.errorSubmitting") }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import { useMainStore, useAuthStore } from "~/store";

const authStore = useAuthStore();
const mainStore = useMainStore();

const user = computed(() => authStore.user);

const props = defineProps({
  submitted: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  isRecipeOwner: {
    type: Boolean,
    deafult: false,
  },
});
const anonymous = ref(false);
const comment = ref("");

function handleSubmit() {
  const submitDate = JSON.stringify(new Date());

  const commentObj = {
    userId: user.value.id,
    username: user.value.displayName,
    photoURL: (user.value.photoURL && user.value.photoURL) || "",
    isAnonymous: anonymous.value,
    comment: comment.value,
    submitDate,
    approved: props.isRecipeOwner,
  };
  emit("addComment", commentObj);
}
</script>
