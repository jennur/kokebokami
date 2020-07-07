<template>
  <div>
    <div id="actionBar" class="flex-row">
      <button
        class="button button--small button--green-border margin-bottom--large margin-right--large"
        @click="handlePdfExport"
      >
        <download-icon class="icon icon--in-button margin-right--medium" />Download as PDF
      </button>
      <button
        v-if="!sharing"
        @click="toggleShareBox"
        class="button button--small button--green-border"
      >
        <share-icon class="icon icon--in-button margin-right--medium" />Share recipe
      </button>
      <button
        v-else
        class="button button--small button--transparent button--transparent-red"
        @click="toggleShareBox"
      >✕ Close</button>
    </div>
    <share-form
      class="margin-top--xlarge"
      :open="sharing"
      :recipeKey="recipeKey"
      :recipeOwnerID="recipeOwnerID"
    />
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
    }
  },
  methods: {
    toggleShareBox() {
      this.sharing = !this.sharing;
    },
    handlePdfExport() {
      this.$emit("download");
    }
  }
};
</script>
