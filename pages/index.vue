<template>
  <div>
    <div v-if="user && !user.id">
      <CtaSection />
    </div>

    <div class="desktop-width padding-h-lg margin-top-2xl margin-auto">
      <FilterSection :recipes="publicRecipes" @filter="setVisibleRecipes" />
      <div class="flex-row flex-row--nowrap">
        <RecipesList
          v-if="loaded"
          :recipes="visibleRecipes"
          :isPublicList="true"
          :addRecipeUrl="$localePath('/account/my-cookbook/add-recipe')"
        />
        <div v-else class="container">
          <span class="simple-loading-spinner margin-auto"></span>
        </div>
      </div>
    </div>
    <SignUpSection
      v-if="user && !user.id"
      id="signUp"
      class="container--dark padding-top-3xl"
      :darkBg="true"
    />
  </div>
</template>

<script setup>
import useUser from "~/composables/user.js";
import { useRecipeStore } from "../store/recipeStore";

import CtaSection from "~/components/CTASection/CTASection.vue";
import SignUpSection from "~/components/SignUpSection/SignUpSection.vue";
import RecipesList from "~/components/RecipePreview/RecipesList.vue";
import FilterSection from "~/components/Filter/FilterSection";

const initialFiltered = ref(true);
const filteredRecipes = ref([]);
const isFiltered = ref(false);

definePageMeta({
  layout: "fullwidth",
});

useHead(() => {
  return {
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/",
      },
    ],
    script: [
      {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "Organization",
          url: "https://kokebokami.com",
          logo: {
            "@type": "ImageObject",
            url: "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2Fkokebokami-assets%2FlogoK-round.png?alt=media&token=a018646d-0837-44cc-9a2c-01c251f5ec84",
            width: 500,
            height: 500,
          },
          sameAs: ["https://www.facebook.com/kokebokami"],
        },
      },
      {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://kokebokami.com",
        },
      },
    ],
  };
});

const { publicRecipes, loaded } = useRecipeStore();

const user = computed(() => useUser());

const initialRecipes = computed(() => {
  const { locale } = useI18n();
  const language = locale === "no" ? "Norwegian" : "English";

  return publicRecipes.filter((recipe) => {
    return (
      recipe.language &&
      recipe.language.toLowerCase() === language.toLowerCase()
    );
  });
});

const visibleRecipes = computed(() => {
  if (initialFiltered.value) return initialRecipes.value;
  if (!isFiltered.value && !initialFiltered.value) return publicRecipes;
  if (isFiltered.value) return filteredRecipes.value;
});

const setVisibleRecipes = ({ recipes, filtered }) => {
  initialFiltered.value = false;
  filteredRecipes.value = recipes;
  isFiltered.value = filtered;
};
</script>
