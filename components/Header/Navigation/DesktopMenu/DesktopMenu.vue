<template>
  <div class="desktop-menu">
    <div v-if="user && !user.id" class="login-menu">
      <GoogleLogin tabindex="0" />
    </div>

    <div v-if="user && user.id" class="account-menu margin-bottom-sm">
      <UserImage :username="user.displayName" :photoURL="user.photoURL" />
      <NuxtLink class="account-menu_button" :to="$localePath('/account')">
        {{ accountMenu.title }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import GoogleLogin from "~/components/Login/GoogleLogin.vue";
import UserImage from "~/components/Header/Navigation/UserImage.vue";
import useUser from "~/composables/user.js";

const { $localePath } = useNuxtApp();

const user = computed(() => useUser());

const accountMenu = computed(() => {
  return {
    link: $localePath("/account/"),
    title: `${user.value && user.value.displayName}`,
    img: {
      url: user.value && user.value.photoURL
    },
    subLinks: [
      {
        path: $localePath("/account/"),
        title: "Dashboard",
        icon: () => import(`~/assets/graphics/icons/dashboard-icon.svg`)
      },
      {
        path: $localePath("/account/my-cookbook/"),
        title: "My cookbook",
        icon: () => import(`~/assets/graphics/icons/cookbook-icon.svg`)
      },
      {
        path: $localePath("/account/account-details/"),
        title: "Account details",
        icon: () =>
          import(`~/assets/graphics/icons/account-details-icon.svg`)
      }
    ]
  }
});
</script>
