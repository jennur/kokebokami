<template>
  <div class="container container--center">
    <BreadCrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom-lg">{{ headlineText }}</h1>
    <div
      v-click-outside="closeDropdown"
      class="container container--center add-recipe"
    >
      <button
        v-if="!addRecipeFromUrl"
        class="button button-lg button--round margin-auto margin-v-xl"
        @click="toggleDropdown"
      >
        {{ $t("navigation.addRecipe") }}
      </button>
      <transition name="pop-modal" tag="div">
        <div v-if="dropdown" class="add-recipe-dropdown">
          <NuxtLink
            :to="$localePath('/account/my-cookbook/add-recipe/')"
            class="add-recipe-dropdown_link"
            >{{ $t("navigation.addPersonalRecipe") }}</NuxtLink
          >
          <button @click="toggleRecipeForm" class="add-recipe-dropdown_link">
            {{ $t("navigation.addRecipeLink") }}
          </button>
        </div>
      </transition>
    </div>
    <!-- Add recipe from URL -->
    <ExpandTransition :show="addRecipeFromUrl">
      <AddRecipeFromUrlForm @cancel="toggleRecipeForm" @save="handleLinkSave" />
    </ExpandTransition>

    <!-- Recipes list -->
    <Tabs
      class="margin-top-xl"
      :tabTitles="[
        $t('myCookbook.tabs.myRecipes'),
        $t('myCookbook.tabs.myRecipeLinks'),
        $t('myCookbook.tabs.myFavorites'),
      ]"
      :activeTabIndexControl="activeTabIndex"
      @switchTab="(index) => handleTabSwitch(index)"
    >
      <RecipesList
        v-if="activeTabIndex === 0 || activeTabIndex === 2"
        class="margin-top-lg padding-bottom-lg"
        :recipes="visibleRecipes"
        :isPublicList="activeTabIndex === 2"
        :emptyListMessage="emptyListMessage"
        :addRecipeUrl="
          activeTabIndex === 0 ? '/account/my-cookbook/add-recipe/' : ''
        "
      />
      <div v-if="activeTabIndex === 1">
        <RecipeLinkList
          class="margin-top-2xl"
          :hiddenCategories="hiddenCategories"
          :links="recipeStore.userLinks"
          :emptyListMessage="emptyListMessage"
          @open-form="toggleRecipeForm"
          @update="recipeStore.REFRESH_USER_LINKS"
        />
      </div>
    </Tabs>
  </div>
</template>

<script setup>
import ExpandTransition from "~/components/Transitions/Expand.vue";
import AddRecipeFromUrlForm from "~/components/AddRecipeFromUrlForm.vue";
import Tabs from "~/components/Tabs.vue";
import RecipesList from "~/components/RecipesList.vue";
import RecipeLinkList from "~/components/RecipeLinkList/RecipeLinkList.vue";
import { useAuthStore, useRecipeStore } from "~/store";
import { onMounted } from "vue";

const authStore = useAuthStore();
const recipeStore = useRecipeStore();
const { t } = useI18n();

useHead(() => {
  return {
    title: `My cookbook | Kokebokami`,
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/my-cookbook/",
      },
    ],
  };
});

const activeTabIndex = ref(0);
const dropdown = ref(false);
const addRecipeFromUrl = ref(false);
const hiddenCategories = ref([]);

const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    {
      name: t("navigation.myAccount"),
      link: "/account/",
    },
    { name: t("navigation.myCookbook") },
  ];
});
const emptyListMessage = computed(() => {
  if (activeTabIndex.value === 0)
    return "You didn't add any recipes yet 👩‍🍳 Your personal recipes will appear in this list";
  else if (activeTabIndex.value === 1)
    return "You didnt add any recipes to this list yet. 🤷🏼‍♀️ The recipes you add from URL will appear in this list.";
  else if (activeTabIndex.value === 2)
    return "You didn't add any favorites yet! 🤷🏾‍♂️";
});

const firstName = computed(() => {
  const { displayName: username } = authStore.user;
  if (username && username !== "User") {
    return /\s/.test(username) ? username.split(" ")[0] : username;
  }
  return null;
});

const headlineText = computed(() => {
  if (firstName.value) return `${firstName.value}'s kokebok`;
  else return "My kokebok";
});

const visibleRecipes = computed(() => {
  if (activeTabIndex.value === 0) return recipeStore.userRecipes;
  if (activeTabIndex.value === 2) return recipeStore.userFavorites;
});

function handleLinkSave() {
  recipeStore.REFRESH_USER_LINKS();
  activeTabIndex.value = 1;
  addRecipeFromUrl.value = false;
}
function closeDropdown() {
  dropdown.value = false;
}
function toggleDropdown() {
  dropdown.value = !dropdown.value;
}
function toggleRecipeForm() {
  addRecipeFromUrl.value = !addRecipeFromUrl.value;
  dropdown.value = false;
}
function handleTabSwitch(index) {
  activeTabIndex.value = index;
}

onMounted(() => {
  recipeStore.REFRESH_USER_LINKS();
});
</script>
