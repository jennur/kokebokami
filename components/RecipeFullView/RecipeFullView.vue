<template>
  <section ref="recipe" id="recipe" class="recipe margin-auto">
    <div
      class="flex-row flex-row--align-center flex-justify--space-between margin-bottom-xl"
    >
      <div class="flex-row flex-row--align-center flex-row--nowrap">
        <SettingsDropdown v-if="isRecipeOwner" class="margin-right-md">
          <PublicNote
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            :isPublic="recipe.public"
            @update="(payload) => emit('update', payload)"
          />
          <span v-if="recipe.id" class="system-message" @click="toggleAlert">
            <delete-icon tabindex="0" class="icon margin-right-sm" />{{
              $t("recipes.deleteRecipe")
            }}
          </span>
        </SettingsDropdown>

        <span v-if="recipe.public" class="public-note">{{
          $t("recipes.public")
        }}</span>

        <div v-if="recipe.datePublished" class="recipe_dates">
          <div>
            <span class="label">Published:</span>
            {{ recipe.datePublished }}
          </div>
          <div v-if="recipe.dateModified">
            <span class="label">Updated:</span>
            {{ recipe.dateModified }}
          </div>
        </div>
      </div>

      <a
        v-if="recipe.blog"
        href="#recipeSection"
        class="button button-xs recipe-jump-btn"
        >{{ $t("jumpToRecipe") }}</a
      >
    </div>

    <BlogContent
      :recipeKey="recipe.id"
      :is-recipe-owner="isRecipeOwner"
      :blog="recipe.blog"
      :recipe-title="recipe.title"
      @update="(payload) => emit('update', payload)"
    />

    <div
      class="flex-row flex-row--align-center flex-row--space-between margin-bottom-lg"
    >
      <div class="flex-row flex-row--align-center">
        <Rating
          v-if="recipe.id"
          :rating="recipe.rating"
          :recipeKey="recipe.id"
          :show-total-votes="true"
          class="margin-right-lg"
        />
        <AddToFavorites
          v-if="recipe.id"
          :recipe-key="recipe.id"
          :favorites-count="recipe.favoritesCount"
          :show-count="true"
        />
      </div>

      <ActionBar
        v-if="recipe.id"
        :isRecipeOwner="isRecipeOwner"
        :recipeOwnerID="recipe.ownerID"
        :recipeKey="recipe.id"
        :recipeTitle="recipe.title"
        :recipeDescription="recipe.description"
        :recipePublic="recipe.public"
        @download="pdfExport"
      />
    </div>

    <Alert
      :alertMessage="`${$t('recipes.deleteAlert.beforeTitle')}: ${recipe.title}?
          ${$t('recipes.deleteAlert.afterTitle')}.`"
      :showAlert="showAlert"
      @confirmed="deleteRecipe"
      @cancel="toggleAlert"
    />

    <div class="recipe_details-wrap">
      <PhotoDisplay
        :photoURL="recipe.photoURL"
        :isRecipeOwner="isRecipeOwner"
        :recipeKey="recipe.id"
        @update="(payload) => emit('update', payload)"
      />

      <div id="recipeDetails" class="recipe_details">
        <LanguageDisplay
          class="margin-right-xl"
          v-if="isRecipeOwner"
          :language="recipe.language"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="(payload) => emit('update', payload)"
        />
        <TypeOfMealDisplay
          v-if="recipe.typeOfMeal || isRecipeOwner"
          :typeOfMeal="recipe && recipe.typeOfMeal"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="(payload) => emit('update', payload)"
        />
        <FreeFromDisplay
          v-if="recipe.freeFrom || isRecipeOwner"
          :freeFrom="recipe && recipe.freeFrom"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          class="margin-bottom-xl"
          @update="(payload) => emit('update', payload)"
        />

        <TitleDisplay
          :title="recipe.title"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="(payload) => emit('update', payload)"
        />
        <DescriptionDisplay
          :description="recipe.description"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="(payload) => emit('update', payload)"
        />

        <CategoryDisplay
          v-if="recipe.categories || isRecipeOwner"
          :categories="recipe.categories && Object.values(recipe.categories)"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          class="margin-bottom-2xl"
          @update="(payload) => emit('update', payload)"
        />

        <div class="flex flex-justify--space-between flex-align--end">
          <PrepTime
            :is-recipe-owner="isRecipeOwner"
            :prep-time="recipe.prepTime"
            :cooking-time="recipe.cookingTime"
            :recipe-key="recipe.id"
            @update="(payload) => emit('update', payload)"
          />

          <div class="recipe_category-note">
            {{ $t("recipes.publishedBy") }}
            <NuxtLink :to="$localePath(`/cooks/${author && author.path}`)">
              {{ author && author.displayName }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="recipe-content-wrap margin-v-xl">
      <IngredientsDisplay
        class="recipe_ingredients-wrap"
        :ingredients="recipe.ingredients"
        :servings="recipe.servings || ''"
        :recipeTitle="recipe.title"
        :isRecipeOwner="isRecipeOwner"
        :recipeKey="recipe.id"
        @update="(payload) => emit('update', payload)"
        @calculated-ingredients="setCalculatedIngredients"
      />

      <InstructionsDisplay
        class="recipe_instructions-wrap"
        :instructions="recipe.instructions"
        :isRecipeOwner="isRecipeOwner"
        :recipeKey="recipe.id"
        @update="(payload) => emit('update', payload)"
      />
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref, remove } from "firebase/database";
import { ref as storageRef, getStorage } from "firebase/storage";
import { useRouter } from "vue-router";
import pdfExport from "~/helpers/pdfExport";

import Rating from "./Interaction/Rating.vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";
import PublicNote from "./Displays/PublicNote.vue";
import LanguageDisplay from "./Displays/LanguageDisplay.vue";
import PhotoDisplay from "./Displays/PhotoDisplay.vue";
import TitleDisplay from "./Displays/TitleDisplay.vue";
import DescriptionDisplay from "./Displays/DescriptionDisplay.vue";
import CategoryDisplay from "./Displays/CategoryDisplay.vue";
import FreeFromDisplay from "./Displays/FreeFromDisplay";
import TypeOfMealDisplay from "./Displays/TypeOfMealDisplay";
import PrepTime from "./Displays/PrepTime";
import IngredientsDisplay from "./Displays/IngredientsDisplay.vue";
import InstructionsDisplay from "./Displays/InstructionsDisplay.vue";

import ActionBar from "./Interaction/ActionBar.vue";
import Alert from "~/components/Alert.vue";
import AddToFavorites from "./Interaction/AddToFavorites.vue";
import BlogContent from "../BlogContent/BlogContent.vue";

const emit = defineEmits(["update"]);

const props = defineProps({
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    default: () => {},
  },
  author: {
    type: Object,
    default: () => {},
  },
});

const showAlert = ref(false);
const calculatedIngredients = ref({});

function setCalculatedIngredients(ingredientsObj) {
  calculatedIngredients.value = ingredientsObj;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

async function deleteRecipeImage() {
  if (props.recipe.photoURL !== "") {
    const storage = getStorage();
    return deleteObject(storageRef(storage, props.recipe.photoURL))
      .then(() => {
        console.info("[deleteRecipeImage] Successfully deleted image");
      })
      .catch((error) => console.error("[deleteRecipeImage]", error.message));
  }
}

function deleteRecipe() {
  const router = useRouter();
  if (props.recipe.id) {
    deleteRecipeImage()
      .then(() => {
        const db = getDatabase();
        remove(ref(db, `recipes/${props.recipe.id}`))
          .then(() => {
            router.push("/account/my-cookbook/");
          })
          .catch((error) => {
            systemMessage.value = error.message;
            console.error("[deleteRecipe]", error.message);
          });
      })
      .catch((error) => {
        systemMesage.value =
          "Something went wrong when attempting to delete the recipe...";
      });
  }
}
</script>
