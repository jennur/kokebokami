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
<script setup>
import ShareForm from "./ShareForm.vue";

const emit = defineEmits(["download"]);
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
  recipeKey: {
    type: String,
    default: "",
  },
  recipeOwnerID: {
    type: String,
    default: "",
  },
  recipeTitle: {
    type: String,
    default: "",
  },
  recipeDescription: {
    type: String,
    default: "",
  },
  recipePublic: {
    type: Boolean,
    default: false,
  },
});

const sharing = ref(false);

function openShareModal() {
  sharing.value = true;
}

function closeShareModal() {
  sharing.value = false;
}

function handlePdfExport() {
  emit("download");
}
</script>
