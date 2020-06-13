<template>
  <div>
    <div id="actionBar" class="flex-row">
      <span
        role="button"
        class="button button--small button--green-border button--mobile-expand margin-bottom--large margin-right--large"
        @click="handlePdfExport"
      >
        <download-icon class="icon icon--in-button margin-right--medium" />Download as PDF
      </span>
      <span
        role="button"
        @click="toggleShareBox"
        class="button button--small button--green-border button--mobile-expand margin-right--large"
      >
        <share-icon class="icon icon--in-button margin-right--medium" />
        {{ shareButtonText }}
      </span>

      <div v-if="isRecipeOwner">
        <button @click="handleEditMode" class="button button--small button--transparent">Edit mode</button>
      </div>
    </div>
    <share-form :open="sharing" :recipeKey="recipeKey" :recipeOwnerID="recipeOwnerID" />
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
      sharing: false,
      shareButtonText: "Share recipe"
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
    }
  },
  methods: {
    handleEditMode() {
      this.$emit("edit");
    },
    toggleShareBox() {
      this.sharing = !this.sharing;
      this.shareButtonText = this.sharing ? "Close share box" : "Share recipe";
    },
    handlePdfExport() {
      this.$emit("download");
    }
  }
};
</script>
