<template>
  <div class="scroll-button">
    <transition name="pop">
      <button v-show="showButton" @click="scrollToTop" tabindex="0">
        <UpArrow />
      </button>
    </transition>
  </div>
</template>

<script setup>
import { onUnmounted } from "vue";
import UpArrow from "~/assets/graphics/icons/up-arrow.svg";

const showButton = ref(false);

function handleScroll() {
  if (import.meta.client) {
    if (window.pageYOffset > 500) showButton.value = true;
    else showButton.value = false;
  }
}
function scrollToTop() {
  if (import.meta.client) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>
