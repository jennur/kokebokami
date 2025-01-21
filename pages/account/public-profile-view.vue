<template>
  <section>
    <BreadCrumbs :routes="breadcrumbs" />
    <div class="system-message system-message--with-bg margin-v-lg">
      {{ $t("accountDetails.publicProfileViewNote") }}
    </div>
    <ProfileView :user="user && !user.hiddenProfile ? user : null" />
    <h3>{{ $t("cooks.checkOutMyRecipes") }}</h3>
    <RecipesList
      :recipes="publicUserRecipes"
    />
  </section>
</template>

<script setup>
import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/RecipePreview/RecipesList";
import { useAuthStore, useRecipeStore } from "~/store";

const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const { t } = useI18n();

useHead(() => {
  return {
    title: `Profile preview | Kokebokami`,
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/public-profile-view/",
      },
    ],
  };
});

const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    {
      name: t("navigation.myAccount"),
      link: "/account/",
    },
    {
      name: t("navigation.accountDetails"),
      link: "/account/account-details/",
    },
    { name: t("navigation.publicProfileView") },
  ];
});

const publicUserRecipes = computed(() => {
  return recipeStore.publicRecipes.filter((recipe) => {
    return recipe.ownerID === authStore.user.id;
  }) || [];
});
</script>
