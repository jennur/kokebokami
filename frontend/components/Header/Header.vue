<template>
  <header>
    <div class="header--space-reserver"></div>
    <div :class="`header ${scrollDown ? '' : 'header--open'}`">
      <navigation @toggle-menu="handleMenu" />
    </div>
    <username-modal :open="$store.state.showUsernameModal" />
  </header>
</template>

<script>
import Navigation from "./Navigation/Navigation.vue";
import UsernameModal from "~/components/Login/UsernameModal";

export default {
  name: "header-component",
  components: {
    Navigation,
    UsernameModal
  },
  data() {
    return { previousScrollValue: 0, scrollDown: false, menuOpen: false };
  },
  methods: {
    handleMenu(status) {
      this.menuOpen = status;
    },
    handleScroll() {
      let currentScrollValue = process.browser && window.pageYOffset;
      if (
        currentScrollValue > 0 &&
        currentScrollValue > this.previousScrollValue
      ) {
        this.previousScrollValue = currentScrollValue;
        if (currentScrollValue >= 50 && !this.menuOpen) {
          this.scrollDown = true;
        }
      } else {
        this.previousScrollValue = currentScrollValue;
        this.scrollDown = false;
      }
    }
  },
  mounted() {
    if (process.browser) window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    if (process.browser)
      window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
