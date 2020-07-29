<template>
  <div
    v-if="isRecipeOwner"
    class="recipe__public-note full-width flex-column flex-column--align-right margin-bottom--large"
  >
    <button
      v-if="!loading"
      class="button button--xsmall button--green-border button--round"
      @click="togglePublic"
      :key="updated"
    >
      Make recipe {{ isPublic ? "private" : "public" }}
    </button>
    <span v-if="loading" class="simple-loading-spinner"></span>
  </div>
</template>
<script>
export default {
  name: "public-note",
  props: {
    isPublic: {
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
    }
  },
  data() {
    return {
      loading: false,
      updated: 1
    };
  },
  methods: {
    togglePublic() {
      this.loading = true;
      let isPublic = !this.isPublic;
      let publicRef = this.$fireDb.ref(`recipes/${this.recipeKey}/public`);
      publicRef
        .set(isPublic)
        .then(() => {
          console.log("Successfully updated public status");
          this.$emit("update");
          this.loading = false;
          this.updated++;
        })
        .catch(error =>
          console.log("Error updating public status:", error.message)
        );
    }
  }
};
</script>
