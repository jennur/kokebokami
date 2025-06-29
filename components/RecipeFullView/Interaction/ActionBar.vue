<template>
  <div>
    <div id="actionBar" class="flex-row">

      <!--   PDF download   -->
      <button
        class="button button--w-icon-round"
        @click="handlePdfExport"
        title="Download as PDF"
      >
        <i-download-icon class="icon icon-sm" />
      </button>

      <!--   Email share   -->
      <button
        @click="openShareModal"
        class="button button--w-icon-round margin-left-lg"
        title="Share recipe by e-mail"
      >
        <i-email-icon class="icon icon-md" />
      </button>
    </div>

    <share-form
      :open="sharing"
      :recipeKey="recipeKey"
      :recipeOwnerID="recipeOwnerID"
      :recipeTitle="recipeTitle"
      :recipeDescription="recipeDescription"
      @close-modal="closeShareModal"
    />
  </div>
</template>
<script>
import ShareForm from "./ShareForm.vue";
import generatePath from "~/helpers/generatePath.js";

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
  computed: {
    sharePath() {
      return generatePath(this.recipeTitle, this.recipeKey);
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
