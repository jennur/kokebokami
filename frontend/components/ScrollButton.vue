<template>
  <div class="scroll-button">
    <transition name="pop">
      <button v-show="showButton" @click="scrollToTop" tabindex="0">
        <upArrow />
      </button>
    </transition>
  </div>
</template>

<script>
import upArrow from "~/assets/graphics/icons/up-arrow.svg";
export default {
  name: "scroll-button",
  components: {
    upArrow
  },
  data() {
    return {
      showButton: false
    };
  },
  methods: {
    handleScroll() {
      if (process.browser) {
        if (window.pageYOffset > 500) this.showButton = true;
        else this.showButton = false;
      }
    },
    scrollToTop() {
      if (process.browser) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  },
  mounted() {
    if (process.browser) {
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }
};
</script>
