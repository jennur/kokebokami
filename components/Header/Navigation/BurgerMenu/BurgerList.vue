<template>
  <ul class="burger-menu_list">
    <li v-for="menuItem in menuItems" :key="menuItem.title">
      <div class="flex-row flex-row--nowrap flex-row--align-center">
        <user-image
          v-if="menuItem.img"
          :username="user.displayName"
          :photoURL="menuItem.img && menuItem.img.url"
        />
        <span>
          <h5
            v-if="menuItem.headline"
            class="margin-top-2xl margin-bottom-sm color--blue"
          >
            {{ menuItem.headline }}
          </h5>
          <NuxtLink
            v-if="!menuItem.noLink"
            class="burger-menu_link"
            :to="menuItem.path"
            @click.native="emit('close-menu')"
            >{{ menuItem.title }}</NuxtLink
          ></span
        >
      </div>
      <ul
        v-if="menuItem.subLinks"
        class="burger-menu_sub-list margin-top-md margin-bottom-lg"
      >
        <li v-for="link in menuItem.subLinks" :key="link.title">
          <NuxtLink
            class="burger-menu_link"
            :to="link.path"
            @click.native="emit('close-menu')"
            >{{ link.title }}</NuxtLink
          >
        </li>
      </ul>
    </li>
    <li v-if="user && user.id">
      <button class="logout-button" @click="emit('logout')">
        {{ $t("logout") }}
      </button>
    </li>
    <li>
      <h5 class="margin-top-2xl margin-bottom-sm color--blue">
        {{ $t("navigation.footer.languageHeading") }}
      </h5>
    </li>
    <li>
      <NuxtLink class="burger-menu_link" :to="$switchLocalePath('en')"
        >English</NuxtLink
      >
    </li>
    <li>
      <NuxtLink class="burger-menu_link" :to="$switchLocalePath('no')"
        >Norsk (beta)</NuxtLink
      >
    </li>
  </ul>
</template>
<script setup>
import UserImage from "../UserImage.vue";
import { useAuthStore } from "~/store";
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const emit = defineEmits("close-menu", "logout")

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  menuItems: {
    type: Array,
    default: () => []
  }
})
</script>
