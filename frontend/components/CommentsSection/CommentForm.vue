<template>
  <div class="comment-form-wrap">
    <form class="comment-form">
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
        <span class="margin-left--medium">{{anonymous ? "Anonymous" : user.displayName}}</span>
      </div>
      <label class="comment-form__anonymous flex-row flex-row--align-center margin-vertical--large">
        <input type="checkbox" v-model="anonymous" />
        <span class="margin-left--small">I want to be anonymous</span>
      </label>
      <label>
        <textarea
          class="comment-form__comment"
          placeholder="Your comment..."
          tabindex="0"
          v-model="comment"
        ></textarea>
      </label>
      <label class="comment-form__submit-wrap margin-top--medium">
        <button type="submit" class="button button--small" @click.prevent="handleSubmit">Submit</button>
      </label>
    </form>
    <transition name="fade">
      <div
        v-if="submitted"
        class="comment-form__success padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >🎉Your comment was successfully added and is awaiting approval</div>
    </transition>
    <transition name="fade">
      <div
        v-if="error"
        class="comment-form__error padding-vertical--medium padding-horizontal--large margin-vertical--large"
      >🌧An error occured while posting your comment. Please try again later.</div>
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
