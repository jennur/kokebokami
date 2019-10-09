<template>
  <nav class="navigation-menu">
    <h1 class="navigation-menu__logo">
      <nuxt-link class="navigation-menu__logo-link" to="/">Kokebokami</nuxt-link>
    </h1>
    <ul class="navigation-menu__list">
      <li v-for="menuItem in menuItems" :key="menuItem.name">
        <img
          v-if="menuItem.img"
          class="google-profile-picture"
          :src="menuItem.img"
          alt="Google profile picture"
        />
        <nuxt-link class="navigation-menu__link" :to="menuItem.link">{{menuItem.name}}</nuxt-link>
      </li>
      <li v-if="user">
        <button class="logout-button" @click="logOut">Log out</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "navigation",
  mixins: [user],
  computed: {
    menuItems() {
      let menuItems = [];
      if (this.user !== null && this.user !== undefined) {
        menuItems = [
          { link: "/account", name: this.user.name, img: this.user.profileImg }
        ];
      } else {
        menuItems = [
          { link: "/", name: "Home" },
          { link: "/login", name: "Log in" }
        ];
      }
      return menuItems;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push("/");
    }
  }
};
</script>
