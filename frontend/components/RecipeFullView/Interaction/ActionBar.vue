<template>
  <div>
    <div id="actionBar" class="flex-row">
      <button
        class="button button--with-icon-round margin-bottom--large margin-right--large"
        @click="handlePdfExport"
        title="Download as PDF"
      >
        <download-icon class="icon icon-sm" />
      </button>
      <button
        @click="openShareModal"
        class="button button--with-icon-round"
        title="Share this recipe"
      >
        <share-icon class="icon icon-sm" />
      </button>
    </div>
    <transition name="pop-modal" v-if="sharing">
      <share-form
        :recipeKey="recipeKey"
        :recipeOwnerID="recipeOwnerID"
        :recipeTitle="recipeTitle"
        :recipeDescription="recipeDescription"
        :recipePublic="recipePublic"
        @close-modal="closeShareModal"
      />
    </transition>
  </div>
</template>
<script>
import ShareForm from "./ShareForm.vue";

export default {
  name: "action-bar",
  components: {
    ShareForm
  },
  data() {
    return {
      sharing: false
    };
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: ""
    },
    recipeOwnerID: {
      type: String,
      default: ""
    },
    recipeTitle: {
      type: String,
      default: ""
    },
    recipeDescription: {
      type: String,
      default: ""
    },
    recipePublic: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openShareModal() {
      this.sharing = true;
    },
    closeShareModal() {
      this.sharing = false;
    },
    handlePdfExport() {
      this.$emit("download");
    }
  }
};
</script>
