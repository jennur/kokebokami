<template>
  <header>
    <div class="header--space-reserver"></div>
    <div :class="`header ${scrollDown ? '' : 'header--open'}`">
      <Navigation @toggle-menu="handleMenu" />
    </div>

    <LoadingSplash v-if="$store.showLoadingSplash" />
  </header>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import Navigation from "./Navigation/Navigation.vue";
import LoadingSplash from "~/components/Login/LoadingSplash";

const previousScrollValue = ref(0);
const scrollDown = ref(false);
const menuOpen = ref(false);

function handleMenu(open) {
  menuOpen.value = open;
}

function handleScroll() {
  let currentScrollValue = import.meta.client && window.scrollY;
  if (
    currentScrollValue > 0 &&
    currentScrollValue > previousScrollValue.value
  ) {
    previousScrollValue.value = currentScrollValue;
    if (currentScrollValue >= 50 && !menuOpen.value) {
      scrollDown.value = true;
    }
  } else {
    previousScrollValue.value = currentScrollValue;
    scrollDown.value = false;
  }
}

onMounted(() => {
  if (import.meta.client) window.addEventListener("scroll", handleScroll);
})

onUnmounted(() => {
  if (import.meta.client)
    window.removeEventListener("scroll", handleScroll);
})

</script>
