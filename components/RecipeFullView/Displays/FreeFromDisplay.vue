<template>
  <div class="recipe_category-note margin-top-sm">
    <p class="margin-top-sm margin-bottom-sm">
      <b>{{ $t("recipes.freeFrom") }}:</b>
      <span
        v-if="!editMode && !loading"
        class="recipe_type-of-meal"
        :class="{ editable: isRecipeOwner }"
        @click="event => toggleEditMode(event)"
        >{{ freeFromList }}</span
      >
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !freeFromList && !editMode"
        class="icon"
        @click="event => toggleEditMode(event)"
      />
      <category-edit
        v-if="editMode"
        :existingTypes="freeFrom"
        :allTypes="allFreeFrom"
        @save="saveFreeFrom"
      />
      <span v-if="loading" class="simple-loading-spinner"></span>
    </p>
  </div>
</template>
<script>
import CategoryEdit from "./Editing/CategoryEdit.vue";

export default {
  name: "type-of-meal-display",
  components: {
    CategoryEdit
  },
  props: {
    freeFrom: {
      type: Array,
      default: () => []
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
      editMode: false,
      loading: false
    };
  },
  computed: {
    freeFromList() {
      let allAllergens = this.$store.state.allCategories.allergens;
      let localeAllergens = this.$t("recipes.allCategories.allergens");
      return this.freeFrom
        .map(type => {
          let index = allAllergens.indexOf(type);
          type = localeAllergens[index];
          return type.charAt(0).toUpperCase() + type.slice(1, type.length);
        })
        .join(", ");
    },
    allFreeFrom() {
      return this.$store.state.allCategories.allergens;
    }
  },
  methods: {
    toggleEditMode(event) {
      event && event.stopPropagation();
      if (this.isRecipeOwner) {
        this.editMode = !this.editMode;
      }
    },
    saveFreeFrom(allergens) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        this.loading = true;
        let freeFromRef = this.$fire.database.ref(`recipes/${recipeKey}/freeFrom`);
        freeFromRef
          .set(allergens)
          .then(() => {
            console.log("Successfully updated free from");
            this.loading = false;
            this.$emit("update");
          })
          .catch(error =>
            console.log("Error setting free from:", error.message)
          );
      } else {
        this.$emit("update", { freeFrom: allergens });
      }
    }
  }
};
</script>
