<template>
  <nav
    v-click-outside="closeMenu"
    class="navigation-menu padding-horizontal--large margin--auto desktop-width"
  >
    <h1 class="navigation-menu__logo">
      <nuxt-link class="navigation-menu__logo-link" to="/"
        >Kokebokami</nuxt-link
      >
    </h1>
    <!-- Burger menu -->
    <burger-icon @click.native="toggleMenu" :open="open" />
    <transition name="burger-list-slide">
      <burger-list
        v-if="open"
        :menuItems="menuItems"
        :user="user"
        @closeMenu="toggleMenu"
        @logout="logOut"
      />
    </transition>

    <!-- Desktop menu -->
    <div class="navigation-menu__list-container">
      <ul class="navigation-menu__list">
        <li v-for="menuItem in menuItems" :key="menuItem.name">
          <!-- User profile img-->
          <img
            v-if="menuItem.img && menuItem.img.url"
            class="google-profile-picture"
            :src="menuItem.img.url"
            :alt="`${user.displayName} profile picture`"
          />
          <span
            v-if="menuItem.img && !menuItem.img.url"
            class="google-profile-picture--backup"
          >
            <BackupImg />
          </span>

          <!-- Link -->
          <nuxt-link
            class="navigation-menu__link"
            :to="menuItem.link"
            @click.native="
              () => {
                open = false;
              }
            "
            >{{ menuItem.name }}</nuxt-link
          >
        </li>
        <li v-if="user">
          <button class="logout-button" @click="logOut">Log out</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import user from "~/mixins/user.js";
import BurgerIcon from "./BurgerMenu/BurgerIcon.vue";
import BackupImg from "~/assets/graphics/cook-silhouette-circle.svg";
import BurgerList from "./BurgerMenu/BurgerList.vue";
import ClickOutside from "vue-click-outside";

export default {
  name: "navigation",
  components: {
    BurgerIcon,
    BurgerList,
    BackupImg
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
            link: "/account/",
            name: "My account",
            img: {
              url: this.user.photoURL
            }
          },
          { link: "/account/my-cookbook/", name: "My cookbook" },
          { link: "/cooks/", name: "Discover cooks" }
        ];
      } else {
        menuItems = [
          { link: "/sign-up/", name: "Sign up" },
          { link: "/login/", name: "Log in" }
        ];
      }
      return menuItems;
    }
  },
  methods: {
    toggleMenu() {
      this.open = !this.open;
      this.$emit("toggleMenu", this.open);
    },
    closeMenu() {
      this.open = false;
      this.$emit("toggleMenu", false);
    },
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push("/");
      this.open = false;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
