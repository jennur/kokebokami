<template>
  <div>
    <div class="header--space-reserver"></div>
    <div :class="`header ${scrollDown ? '' : 'header--open'}`">
      <navigation @toggleMenu="handleMenu" />
    </div>
  </div>
</template>

<script>
import Navigation from "./Navigation/Navigation.vue";
export default {
  name: "header-component",
  components: {
    Navigation
  },
  data() {
    return { previousScrollValue: 0, scrollDown: false, menuOpen: false };
  },
  methods: {
    handleMenu(status) {
      this.menuOpen = status;
    },
    handleScroll() {
      let currentScrollValue = window.pageYOffset;
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
  created() {
    window.addEventListener("scroll", this.handleScroll);
  }
};
</script>
