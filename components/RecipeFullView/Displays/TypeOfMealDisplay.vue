<template>
  <div class="recipe_category-note margin-top-sm">
    <p class="margin-top-sm margin-bottom-sm">
      <b>{{ $t("recipes.typeOfMeal") }}:</b>
      <span
        v-if="!editMode && !loading"
        class="recipe_type-of-meal"
        :class="{ editable: isRecipeOwner }"
        @click="event => toggleEditMode(event)"
        >{{ typeOfMealList }}</span
      >
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !typeOfMealList && !editMode"
        class="icon"
        @click="event => toggleEditMode(event)"
      />
      <category-edit
        v-if="editMode"
        :existingTypes="typeOfMeal"
        :allTypes="allTypesOfMeal"
        @save="saveTypesOfMeal"
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
    typeOfMeal: {
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
    typeOfMealList() {
      let allTypesOfMeal = this.$store.state.allCategories.typeOfMeal;
      let localetypeOfMeal = this.$t("recipes.allCategories.typeOfMeal");
      return this.typeOfMeal
        .map(type => {
          let index = allTypesOfMeal.indexOf(type);
          type = localetypeOfMeal[index];
          return type.charAt(0).toUpperCase() + type.slice(1, type.length);
        })
        .join(", ");
    },
    allTypesOfMeal() {
      return this.$store.state.allCategories.typeOfMeal;
    }
  },
  methods: {
    toggleEditMode(event) {
      event && event.stopPropagation();
      if (this.isRecipeOwner) {
        this.editMode = !this.editMode;
      }
    },
    saveTypesOfMeal(types) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        this.loading = true;
        let typeOfMealRef = this.$fire.database.ref(`recipes/${recipeKey}/typeOfMeal`);
        typeOfMealRef
          .set(types)
          .then(() => {
            console.log("Successfully updated type of meal");
            this.loading = false;
            this.$emit("update");
          })
          .catch(error =>
            console.log("Error setting type of meal:", error.message)
          );
      } else {
        this.$emit("update", { typeOfMeal: types });
      }
    }
  }
};
</script>
