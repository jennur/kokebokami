<template>
  <nav
    class="navigation-menu-wrapper padding-h-lg margin-auto desktop-width"
  >
    <div class="flex-row flex-row--align-center">
      <logo />
      <ul class="navigation-menu_language-selector">
        <li><NuxtLink :to="$switchLocalePath('no')" title="Norsk">NO</NuxtLink></li>
        <li><NuxtLink :to="$switchLocalePath('en')" title="English">EN</NuxtLink></li>
      </ul>
    </div>

    <div class="navigation-menu">
      <desktop-menu class="navigation-menu_desktop-menu" />

      <shortcuts v-if="user && user.id" />

      <burger-menu
        :open="burgerMenuOpen"
        @toggle-menu="toggleMenu"
        @logout="logOut"
        v-click-outside="closeMenu"
      />
    </div>
  </nav>
</template>

<script setup>

import Logo from "./Logo.vue";
import useUser from "~/composables/user.js";
import BurgerMenu from "./BurgerMenu/BurgerMenu.vue";
import DesktopMenu from "./DesktopMenu/DesktopMenu.vue";
import Shortcuts from "./Shortcuts.vue";

const { $localePath, $switchLocalePath, $store, $router } = useNuxtApp();

const burgerMenuOpen = ref(false);
const emit = defineEmits(["toggle-menu"]);

const user = computed(() => useUser());

function toggleMenu() {
  burgerMenuOpen.value = !burgerMenuOpen.value;
  emit("toggle-menu", burgerMenuOpen.value);
}
function closeMenu() {
  burgerMenuOpen.value = false;
  emit("toggle-menu", false);
}
function logOut() {
  $store.dispatch("USER_SIGN_OUT");
  $router.push($localePath("/"));
  burgerMenuOpen.value = false;
}

</script>
