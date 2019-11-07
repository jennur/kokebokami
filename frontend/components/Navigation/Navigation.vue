<template>
  <nav
    class="navigation-menu padding-horizontal--large margin--auto margin-bottom--xxlarge tablet-width"
  >
    <h1 class="navigation-menu__logo">
      <nuxt-link class="navigation-menu__logo-link" to="/">Kokebokami</nuxt-link>
    </h1>
    <burger-icon @click.native="toggleMenu" :open="open" />
    <div
      :class="'navigation-menu__list-container ' + (open ? 'navigation-menu__list-container--open' : '')"
    >
      <ul class="navigation-menu__list">
        <li v-for="menuItem in menuItems" :key="menuItem.name">
          <img
            v-if="menuItem.img"
            class="google-profile-picture"
            :src="menuItem.img"
            alt="Google profile picture"
          />
          <nuxt-link
            class="navigation-menu__link"
            :to="menuItem.link"
            @click.native="()=>{open = false}"
          >{{menuItem.name}}</nuxt-link>
        </li>
        <li v-if="user">
          <button class="logout-button" @click="logOut">Log out</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import BurgerIcon from "./BurgerMenu/BurgerIcon.vue";

export default {
  name: "navigation",
  components: {
    BurgerIcon
  },
  data() {
    return { open: false };
  },
  mixins: [user],
  computed: {
    menuItems() {
      let menuItems = [];
      if (this.user !== null && this.user !== undefined) {
        menuItems = [
          {
            link: "/account",
            name: "My account",
            img: this.user.profileImg
          },
          { link: "/profile", name: "My profile" },
          { link: "/account/my-recipes", name: "My recipes" },
          { link: "/", name: "Discover recipes" }
        ];
      } else {
        menuItems = [
          { link: "/sign-up", name: "Sign up" },
          { link: "/login", name: "Log in" }
        ];
      }
      return menuItems;
    }
  },
  methods: {
    toggleMenu() {
      this.open = !this.open;
    },
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push("/");
      this.open = false;
    }
  }
};
</script>
