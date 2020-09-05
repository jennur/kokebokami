<template>
  <nav class="navigation-menu-wrapper padding-horizontal--large margin--auto desktop-width">
    <logo />
    <div class="navigation-menu">
      <ul v-if="user && !user.id" class="login-menu">
        <li v-for="link in loginMenu" :key="`login-link-${link.title}`">
          <nuxt-link
            :class="{
            'login-menu__signup-btn': link.path === '/sign-up/',
            'login-menu__link': link.path !== '/sign-up/'
          }"
            :to="link.path"
          >{{ link.title }}</nuxt-link>
        </li>
      </ul>
      <desktop-menu
        v-if="user && user.id"
        class="navigation-menu__desktop-menu"
        :accountMenu="accountMenu"
        :loginMenu="loginMenu"
        :user="user"
        @logout="logOut"
      />

      <div v-if="user && user.id" class="navigation-menu__icons">
        <nuxt-link class="icon__link" to="/account/shopping-list/" title="Shopping list">
          <shopping-list-icon class="icon--shopping-list" />
          <transition name="pop">
            <span
              v-show="shoppingListCount && $route.path !== '/account/shopping-list/'"
              class="icon__notification"
            >{{shoppingListCount}}</span>
          </transition>
        </nuxt-link>
        <nuxt-link class="icon__link" to="/cooks/" title="Discover cooks">
          <cooks-icon class="icon--cooks" />
        </nuxt-link>
        <!--         <favorites-icon class="icon--favorites" />
        -->
      </div>

      <burger-menu
        v-if="user && user.id"
        :open="burgerMenuOpen"
        :user="user"
        :menuItems="burgerMenuItems"
        @toggleMenu="toggleMenu"
        @logout="logOut"
        v-click-outside="closeMenu"
      />
    </div>
  </nav>
</template>

<script>
import ClickOutside from "vue-click-outside";

import Logo from "./Logo.vue";
import ShoppingListIcon from "~/assets/graphics/icons/shopping-list-icon.svg";
import CooksIcon from "~/assets/graphics/icons/cooks-icon.svg";
import FavoritesIcon from "~/assets/graphics/icons/favorites-icon.svg";

import user from "~/mixins/user.js";

import BurgerMenu from "./BurgerMenu/BurgerMenu.vue";
import DesktopMenu from "./DesktopMenu/DesktopMenu.vue";

export default {
  name: "navigation",
  components: {
    Logo,
    BurgerMenu,
    DesktopMenu,
    ShoppingListIcon,
    CooksIcon,
    FavoritesIcon,
  },
  data() {
    return { burgerMenuOpen: false };
  },
  mixins: [user],
  computed: {
    shoppingListCount() {
      return this.$store.state.shoppingListCount;
    },
    accountMenu() {
      return {
        link: "/account/",
        title: `${this.user && this.user.displayName}`,
        img: {
          url: this.user && this.user.photoURL,
        },
        subLinks: [
          {
            path: "/account/",
            title: "Dashboard",
            icon: () => import(`~/assets/graphics/icons/dashboard-icon.svg`),
          },
          {
            path: "/account/my-cookbook/",
            title: "My cookbook",
            icon: () => import(`~/assets/graphics/icons/cookbook-icon.svg`),
          },
          {
            path: "/account/account-details/",
            title: "Account details",
            icon: () =>
              import(`~/assets/graphics/icons/account-details-icon.svg`),
          },
        ],
      };
    },
    loginMenu() {
      return [
        { path: "/sign-up/", title: "Sign up" },
        { path: "/login/", title: "Log in" },
      ];
    },
    burgerMenuItems() {
      let menuItems = [];
      if (this.user !== null && this.user !== undefined) {
        menuItems = [
          {
            path: "/account/",
            title: `${this.user.displayName}`,
            img: {
              url: this.user.photoURL,
            },
            subLinks: [
              { path: "/account/my-cookbook/", title: "My cookbook" },
              { path: "/account/shopping-list/", title: "Shopping list" },
              { path: "/account/account-details/", title: "Account details" },
            ],
          },
          { path: "/", title: "Discover public recipes" },
          { path: "/cooks/", title: "Discover cooks" },
        ];
      } else {
        menuItems = [
          { path: "/sign-up/", title: "Sign up" },
          { path: "/login/", title: "Log in" },
        ];
      }
      return menuItems;
    },
  },
  methods: {
    toggleMenu() {
      this.burgerMenuOpen = !this.burgerMenuOpen;
      this.$emit("toggleMenu", this.burgerMenuOpen);
    },
    closeMenu() {
      this.burgerMenuOpen = false;
      this.$emit("toggleMenu", false);
    },
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push("/");
      this.burgerMenuOpen = false;
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>
