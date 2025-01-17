<template>
  <div>
    <BreadCrumbs :routes="breadcrumbRoutes" />

    <div class="flex-row margin-v-2xl">
      <GatewayLink
        v-for="(gateway, index) in gateways"
        :key="`gateway-link-${index}`"
        :gateway="gateway"
      />
    </div>
    <div
      class="full-width flex-column flex-column--align-right margin-v-lg"
    >
      <button class="logout-button" @click="authStore.SIGN_OUT">{{ $t("logout") }}</button>
    </div>
  </div>
</template>

<script setup>
import GatewayLink from "~/components/GatewayLink.vue";
import { useAuthStore } from "~/store";

const { t } = useI18n();
const { $localePath } = useNuxtApp();
const authStore = useAuthStore();


useHead(() => {
  return {
    title: `My account | Kokebokami`,
    meta: [
      {
        name: "robots" ,
        content: "noindex"
      }
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/"
      }
    ]
  }
});

const breadcrumbRoutes = computed(() => [
  { name: t("navigation.home"), link: "/" },
  { name: t("navigation.myAccount") }
]);

const gateways = computed(() => [
  {
    title: t("navigation.shoppingLists"),
    link: $localePath("/account/shopping-list/"),
    description: t("account.shoppingListsDescription"),
    graphic: {
      name: "shopping-list"
    }
  },
  {
    title: t("navigation.myCookbook"),
    link: $localePath("/account/my-cookbook/"),
    description: t("account.myCookbookDescription"),
    graphic: {
      name: "cookbook"
    }
  },
  {
    title: t("navigation.accountDetails"),
    link: $localePath("/account/account-details/"),
    description: t("account.accountDetailsDescription"),
    graphic: {
      name: "account-details"
    }
  }
])
</script>
