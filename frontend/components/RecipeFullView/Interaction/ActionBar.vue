<template>
  <div>
    <div id="actionBar" class="flex-row">

      <!--   PDF download   -->
      <button
        class="button button--with-icon-round margin-bottom-lg margin-right-lg"
        @click="handlePdfExport"
        title="Download as PDF"
      >
        <download-icon class="icon icon-sm" />
      </button>

      <!--   Email share   -->
      <button
        @click="openShareModal"
        class="button button--with-icon-round margin-bottom-lg margin-right-lg"
        title="Share this recipe"
      >
        <email-icon class="icon icon-md" />
      </button>

      <!--   Facebook share   -->
      <a v-if="recipePublic"
         class="button button--with-icon-round"
         target="_blank"
         :href="`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkokebokami.com%2Frecipes%2F${recipeKey}%2F&amp;src=sdkpreparse`"
      >
        <fa :icon="['fab', 'facebook-f']" style="font-size: 20px; color: black;" class="icon icon-sm"/>
      </a>
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
