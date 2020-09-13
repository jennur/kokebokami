<template>
  <div class="comment-form-wrap">
    <form v-if="user && user.id" class="comment-form">
      <div class="flex-row flex-row--align-center position-relative">
        <span class="simple-loading-spinner"></span>
        <div
          v-if="!anonymous && user.photoURL"
          class="comment__user-img"
          role="img"
          :aria-label="`${user.displayName}'s profile image`"
          :style="`background-image: url(${user.photoURL});`"
        ></div>
        <CookSilhouette v-else class="comment__user-img" />
        <span class="margin-left--medium">{{
          anonymous ? "Anonymous" : user.displayName
        }}</span>
      </div>
      <label
        class="comment-form__anonymous flex-row flex-row--align-center margin-vertical--large"
      >
        <input type="checkbox" v-model="anonymous" />
        <span class="margin-left--small">{{
          $t("comments.iWantToBeAnonymous")
        }}</span>
      </label>
      <label>
        <textarea
          class="comment-form__comment"
          :placeholder="`${$t('comments.yourComment')}...`"
          tabindex="0"
          v-model="comment"
        ></textarea>
      </label>
      <label class="comment-form__submit-wrap margin-top--medium">
        <button
          type="submit"
          class="button button--small"
          @click.prevent="handleSubmit"
        >
          {{ $t("submit") }}
        </button>
      </label>
    </form>
    <section v-else class="comment-form">
      <nuxt-link
        :to="localePath('/login/')"
        class="button button--small button--green margin-right--small"
        >{{ $t("loginText") }}</nuxt-link
      >{{ $t("comments.loginNote") }}
    </section>

    <transition name="fade">
      <div
        v-if="submitted && !isRecipeOwner"
        class="comment-form__success padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >
        🎉{{ $t("comments.awaitingApproval") }}
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="error"
        class="comment-form__error padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >
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
      console.log("SubmitDate:", submitDate);

      let commentObj = {
        userId: this.user.id,
        username: this.user.displayName,
        photoURL: this.user.photoURL,
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
