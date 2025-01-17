<template>
  <div>
    <BreadCrumbs :routes="breadcrumbs" />
    <div
      class="cooks container container--center mobile-width margin-top-xl margin-auto"
    >
      <div v-if="user && user.id">
        <h2>{{ $t("cooks.headline") }}</h2>
        <CooksSearch />
      </div>

      <div v-else class="container container--center">
        <h2>{{ $t("cooks.loginHeadline") }}</h2>
        <div>
          <button
            class="button button-sm button--green"
            @click="
              mainStore.SHOW_LOGIN_MODAL({
                open: true,
                headline: 'Log in to discover cooks',
              })
            "
          >
            {{ $t("loginText") }}
          </button>
        </div>
        <CooksSilhouettes class="illustration--cooks" />
      </div>
    </div>

    <div v-if="user && user.id" class="margin-top-xl">
      <Tabs
        class="margin-top-2xl"
        :tabTitles="[$t('cooks.tabs.following'), $t('cooks.tabs.followers')]"
        @switchTab="(index) => handleTabSwitch(index)"
      >
        <CooksList
          v-if="activeTabIndex == 0"
          :cooks="followed"
          :emptyListMessage="$t('cooks.followedEmptyListMessage')"
          class="margin-top-lg"
        />
        <CooksList
          v-if="activeTabIndex == 1"
          :cooks="followers"
          :emptyListMessage="$t('cooks.followersEmptyListMessage')"
          class="margin-top-lg"
        />
      </Tabs>
    </div>
  </div>
</template>
<script setup>
import Tabs from "~/components/Tabs.vue";
import CooksSearch from "~/components/Cooks/CooksSearch/CooksSearch.vue";
import CooksList from "~/components/Cooks/CooksList.vue";
import CooksSilhouettes from "~/assets/graphics/illustrations/cooks.svg";
import { useConnectedUsers } from "~/composables";
import { useMainStore, useAuthStore } from "~/store";

const { t } = useI18n();

const authStore = useAuthStore();
const mainStore = useMainStore();

const { getConnectedUsers } = useConnectedUsers();
const connectedUsers = await getConnectedUsers();


useHead(() => {
  return {
    title: `Discover cooks | Kokebokami`,
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/cooks/",
      },
    ],
  };
});

const activeTabIndex = ref(0);
const followed = ref(connectedUsers.followed);
const followers = ref(connectedUsers.followers);

const user = computed(() => authStore.user);
const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    { name: t("navigation.cooks") },
  ];
});

async function handleTabSwitch(index) {
  activeTabIndex.value = index;
  if (!followed.length && !followers.length) {
    const connectedUsers = await getConnectedUsers();
    followed.value = connectedUsers.followed;
    followers.value = connectedUsers.followers;
  }
}
</script>
