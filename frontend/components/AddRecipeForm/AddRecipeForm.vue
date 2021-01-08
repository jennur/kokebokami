<template>
  <section class="margin--auto margin-top--xlarge">
    <div v-if="editMode" class="text-align--right margin-bottom--medium">
      <delete-icon tabindex="0" @click="toggleAlert" class="icon" />
    </div>
    <Alert
      :alertMessage="
        `Are you sure you want to delete this recipe: ${title}? This operation cannot be undone.`
      "
      :showAlert="showAlert"
      @confirmed="deleteRecipe"
      @cancel="toggleAlert"
    />
    <form v-on:submit.prevent class="add-recipe-form">
      <div>
        <div
          v-if="!imageLoaded"
          class="simple-loading-spinner margin--auto"
        ></div>
        <div
          v-if="photoURL"
          :style="`background-image: url(${photoURL})`"
          class="add-recipe-form__image"
        ></div>
        <image-input
          id="dropImage"
          ref="dropImage"
          @uploaded="updateRecipeImg"
        />
        <div class="text-align--right">
          <button
            v-if="photoURL"
            class="button button--transparent button--transparent-red"
            @click="removePhotoURL"
          >
            ✕ Remove image
          </button>
        </div>
        <span
          v-if="imageSystemMessage"
          class="system-message margin-vertical--large"
          >{{ imageSystemMessage }}</span
        >
      </div>
      <div class="recipes-filter__form">
        <category-filter
          :transparent="true"
          :existingCategories="{ language, typeOfMeal, categories, freeFrom }"
          @setLanguage="updateLanguage"
          @setTypeOfMeal="updateTypeOfMeal"
          @setMealCategories="updateCategories"
          @setFreeFrom="updateFreeFrom"
        />
      </div>

      <div class="mobile-width margin-top--xlarge margin--auto">
        <!-- TITLE / DESCRIPTION -->
        <fieldset class="flex-column">
          <title-input
            id="recipeTitle"
            class="margin-bottom--medium"
            :existingTitle="title"
          />
          <description-input
            id="recipeDescription"
            class="margin-bottom--medium"
            :existingDescription="description"
          />
        </fieldset>

        <!-- INGREDIENTS -->
        <ingredients-input
          :existingIngredients="
            existingRecipe ? existingRecipe.ingredients : []
          "
          :existingServings="existingRecipe ? existingRecipe.servings : ''"
        />

        <!-- INSTRUCTIONS -->
        <instructions-input
          :existingInstructions="
            existingRecipe ? existingRecipe.instructions : []
          "
        />

        <!-- PUBLIC CHECK -->
        <fieldset class="container">
          <label class="flex-row flex-row--align-center flex-row--nowrap">
            <input type="checkbox" id="publicCheck" v-model="publicCheck" />
            <span class="margin-left--small"
              >Make recipe public (share with all users of Kokebokami)</span
            >
          </label>
        </fieldset>

        <!-- SAVE / UPDATE -->
        <save-actions
          :recipeKey="recipeKey"
          :saved="saved"
          :editMode="editMode"
          :systemMessage="systemMessage"
          @save="saveRecipe"
          @cancel="cancel"
          @deleteRecipe="deleteRecipe"
        />
      </div>
    </form>
  </section>
</template>

<script>
const uuid = require("uuid");
import user from "~/mixins/user.js";

import Alert from "~/components/Alert.vue";
import ImageInput from "~/components/Input/ImageInput.vue";
import CategoryFilter from "~/components/Filter/CategoryFilter.vue";
import DescriptionInput from "~/components/Input/DescriptionInput.vue";

import IngredientsInput from "~/components/Input/IngredientsInput.vue";
import InstructionsInput from "~/components/Input/InstructionsInput.vue";
import SaveActions from "./Actions/SaveActions.vue";
import TitleInput from "~/components/Input/TitleInput.vue";

export default {
  name: "add-recipe-form",
  components: {
    Alert,
    ImageInput,
    CategoryFilter,
    DescriptionInput,
    IngredientsInput,
    InstructionsInput,
    SaveActions,
    TitleInput
  },
  props: {
    existingRecipe: { type: Object, default: () => null },
    editMode: { type: Boolean, default: false }
  },
  mixins: [user],
  data() {
    let existingRecipe = this.existingRecipe;
    return {
      recipeKey: this.$route.params.recipeid || "",
      photoURL: (existingRecipe && existingRecipe.photoURL) || "",
      title: (existingRecipe && existingRecipe.title) || "",
      description: (existingRecipe && existingRecipe.description) || "",
      language: (existingRecipe && existingRecipe.language) || "",
      categories: (existingRecipe && existingRecipe.categories) || [],
      freeFrom: (existingRecipe && existingRecipe.freeFrom) || [],
      typeOfMeal: (existingRecipe && existingRecipe.typeOfMeal) || [],
      publicCheck: (existingRecipe && existingRecipe.public) || false,
      systemMessage: "",
      imageSystemMessage: "",
      saved: false,
      imageLoaded: true,
      showAlert: false
    };
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    updateLanguage(language) {
      this.language = language;
    },
    updateCategories(checked) {
      this.categories = checked;
    },
    updateFreeFrom(checked) {
      this.freeFrom = checked;
    },
    updateTypeOfMeal(typeOfMeal) {
      this.typeOfMeal = typeOfMeal;
    },
    cancel() {
      if (!this.editMode) {
        this.$router.push("/account/my-cookbook/");
      } else {
        this.$emit("exitEditMode");
      }
    },
    deleteRecipe() {
      const recipeRef = this.$fire.database.ref("recipes/" + this.recipeKey);
      recipeRef
        .remove()
        .then(() => {
          this.$router.push("/account/my-cookbook/");
        })
        .catch(error => {
          this.systemMessage = error.message;
          console.log("Error deleting recipe:", error.message);
        });
    },
    saveRecipe() {
      let photoURL = this.photoURL;
      if (photoURL === "") {
        this.removeRecipeImg();
      }
      const recipeTitle = document.querySelector("#recipeTitle input");
      const recipeDescription = document.querySelector(
        "#recipeDescription textarea"
      );
      const servings = document.querySelector(".add-recipe-form__servings");

      let ingredientAmounts = document.querySelectorAll(
        "#ingredientList .add-recipe-form__amount"
      );
      let ingredientItems = document.querySelectorAll(
        "#ingredientList .add-recipe-form__ingredient"
      );

      let ingredientList = [];
      for (let i = 0; i < ingredientAmounts.length; i++) {
        ingredientList.push(
          `${ingredientAmounts[i].value} ${ingredientItems[i].value}`
        );
      }

      let instructions = document.querySelectorAll("#instructionList textarea");
      let instructionList = [];
      instructions.forEach(instruction => {
        instructionList.push(instruction.value);
      });
      let recipeObject = {
        photoURL,
        title: recipeTitle.value,
        description: recipeDescription.value,
        servings: servings.value,
        ingredients: ingredientList,
        instructions: instructionList,
        categories: this.categories,
        freeFrom: this.freeFrom,
        typeOfMeal: this.typeOfMeal,
        language: this.language,
        public: this.publicCheck,
        ownerID: this.user.id
      };

      if (this.recipeKey !== "") {
        const recipeRef = this.$fire.database.ref("recipes/" + this.recipeKey);
        recipeRef
          .update(recipeObject)
          .then(() => {
            this.$emit("update");
          })
          .catch(error => {
            this.systemMessage = error.message;
            console.log("Error saving recipe", error.message);
          });
      } else {
        const recipes = this.$fire.database.ref("recipes");
        const newRecipeKey = recipes.push(recipeObject).key;

        if (newRecipeKey !== null) {
          this.systemMessage = "Your recipe was saved successfully!";
          this.saved = true;
          this.recipeKey = newRecipeKey;
        } else
          this.systemMessage =
            "Unable to save recipe. Please try again later or contact us if the issue continues.";
      }
    },
    removePhotoURL() {
      this.photoURL = "";
    },
    async updateRecipeImg(upload) {
      this.removeRecipeImg();
      let componentThis = this;
      var imageName = uuid.v1();
      let recipeKey = this.recipeKey;
      this.imageLoaded = false;
      try {
        //save image
        let file = upload;
        var metadata = {
          contentType: "image/png"
        };
        var storageRef = this.$fire.storage.ref();
        var imageRef = storageRef.child(
          `images/recipes/${recipeKey}/${imageName}.png`
        );
        await imageRef.put(file, metadata);
        await imageRef.getDownloadURL().then(result => {
          componentThis.imageLoaded = true;
          componentThis.photoURL = result;
        });
      } catch (error) {
        console.log("Error updating recipe image:", error.message);
        this.imageSystemMessage = error.message;
      }
    },
    removeRecipeImg() {
      let componentThis = this;
      let recipeKey = this.recipeKey;
      let fileName = this.photoURL;

      var storageRef = this.$fire.storage.ref();
      var imageRef = storageRef.child(`images/recipes/${recipeKey}`);
      imageRef
        .listAll()
        .then(function(res) {
          res.items.forEach(function(itemRef) {
            itemRef.delete();
            componentThis.photoURL = "";
          });
        })
        .catch(function(error) {
          console.log("Error deleting files:", error.message);
          componentThis.removeProfileImgSystemMessage =
            "We're having trouble deleting your image. Please try again later or contact us.";
        });
    }
  }
};
</script>
