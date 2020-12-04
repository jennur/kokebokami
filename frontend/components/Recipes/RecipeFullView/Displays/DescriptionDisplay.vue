<template>
  <div>
    <div
      v-if="!editDescription && !loading"
      class="recipe__description"
      :class="{ editable: isRecipeOwner }"
      @click="event => toggleEditDescription(event)"
    >
      {{ recipeDescription }}
    </div>
    <description-edit
      v-if="isRecipeOwner && editDescription"
      :description="description"
      @save="saveDescription"
    />
    <span v-if="loading" class="simple-loading-spinner"></span>
  </div>
</template>
<script>
import DescriptionEdit from "./Editing/DescriptionEdit.vue";

export default {
  name: "description-display",
  components: {
    DescriptionEdit
  },
  props: {
    description: {
      type: String,
      default: ""
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
      editDescription: false,
      loading: false
    };
  },
  computed: {
    recipeDescription() {
      return this.description ? this.description : "Recipe has no description";
    }
  },
  methods: {
    toggleEditDescription(event) {
      event && event.stopPropagation();
      if (this.isRecipeOwner) {
        this.editDescription = !this.editDescription;
      }
    },
    saveDescription(updatedDescription) {
      this.editDescription = false;
      let recipeKey = this.recipeKey;

      if (recipeKey && updatedDescription !== this.description) {
        this.loading = true;
        let descriptionRef = this.$fire.database.ref(
          `recipes/${recipeKey}/description`
        );
        descriptionRef
          .set(updatedDescription)
          .then(() => {
            console.log("Successfully updated Description");
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error =>
            console.log("Error setting Description:", error.message)
          );
      } else if (!recipeKey) {
        this.$emit("update", { description: updatedDescription });
      }
    }
  }
};
</script>
