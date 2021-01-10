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
        class="comment-form_anonymous flex-row flex-row--align-center margin-vertical-lg"
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
        @click="$store.dispatch('SHOW_LOGIN_MODAL', {open: true, headline: 'Log in to comment on this recipe'})"
      >
        {{ $t("loginText") }}
      </button>
      {{ $t("comments.loginNote") }}
    </section>

    <transition name="fade">
      <div v-if="submitted && !isRecipeOwner" class="comment-form_success padding-vertical-md padding-horizontal-lg margin-vertical-lg">
        🎉{{ $t("comments.awaitingApproval") }}
      </div>
    </transition>

    <transition name="fade">
      <div v-if="error" class="comment-form_error padding-vertical-md padding-horizontal-lg margin-vertical-lg">
        🌧{{ $t("comments.errorSubmitting") }}
      </div>
    </transition>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";

export default {
  name: "comment-form",
  components: { CookSilhouette },
  props: {
    submitted: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    isRecipeOwner: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      anonymous: false,
      comment: "",
      showingPreview: false,
      showingPreviewModal: false
    };
  },
  mixins: [user],
  methods: {
    handleSubmit() {
      let submitDate = JSON.stringify(new Date());

      let commentObj = {
        userId: this.user.id,
        username: this.user.displayName,
        photoURL: this.user.photoURL && this.user.photoURL || "",
        isAnonymous: this.anonymous,
        comment: this.comment,
        submitDate,
        approved: this.isRecipeOwner
      };
      this.$emit("addComment", commentObj);
    }
  }
};
</script>
