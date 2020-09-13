<template>
  <nav
    class="navigation-menu-wrapper padding-horizontal--large margin--auto desktop-width"
  >
    <logo />
    <div class="navigation-menu">
      <desktop-menu
        class="navigation-menu__desktop-menu"
        :accountMenu="accountMenu"
        :loginMenu="loginMenu"
        :user="user"
        @logout="logOut"
      />

      <div v-if="user && user.id" class="navigation-menu__icons">
        <nuxt-link
          :to="localePath('/account/shopping-list/')"
          class="icon__link"
          title="Shopping list"
        >
          <shopping-list-icon class="icon--shopping-list" />
          <transition name="pop">
            <span
              v-show="
                shoppingListCount && $route.path !== '/account/shopping-list/'
              "
              class="icon__notification"
              >{{ shoppingListCount }}</span
            >
          </transition>
        </nuxt-link>
        <nuxt-link
          :to="localePath('/cooks/')"
          class="icon__link"
          title="Discover cooks"
        >
          <cooks-icon class="icon--cooks" />
        </nuxt-link>
        <!--         <favorites-icon class="icon--favorites" />
        -->
      </div>

      <burger-menu
        :open="burgerMenuOpen"
        :user="user"
        :menuItems="burgerMenuItems"
        @toggle-menu="toggleMenu"
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
    FavoritesIcon
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
        link: this.localePath("/account/"),
        title: `${this.user && this.user.displayName}`,
        img: {
          url: this.user && this.user.photoURL
        },
        subLinks: [
          {
            path: this.localePath("/account/"),
            title: "Dashboard",
            icon: () => import(`~/assets/graphics/icons/dashboard-icon.svg`)
          },
          {
            path: this.localePath("/account/my-cookbook/"),
            title: "My cookbook",
            icon: () => import(`~/assets/graphics/icons/cookbook-icon.svg`)
          },
          {
            path: this.localePath("/account/account-details/"),
            title: "Account details",
            icon: () =>
              import(`~/assets/graphics/icons/account-details-icon.svg`)
          }
        ]
      };
    },
    loginMenu() {
      return [
        { path: this.localePath("/sign-up/"), title: this.$t("signUpText") },
        { path: this.localePath("/login/"), title: this.$t("loginText") }
      ];
    },
    burgerMenuItems() {
      let menuItems = [];
      if (this.user && this.user.id !== null) {
        menuItems = [
          {
            path: this.localePath("/account/"),
            title: `${this.user.displayName}`,
            img: {
              url: this.user.photoURL
            },
            subLinks: [
              {
                path: this.localePath("/account/my-cookbook/"),
                title: this.$t("navigation.myCookbook")
              },
              {
                path: this.localePath("/account/shopping-list/"),
                title: this.$t("navigation.shoppingLists")
              },
              {
                path: this.localePath("/account/account-details/"),
                title: this.$t("navigation.accountDetails")
              }
            ]
          },
          {
            path: this.localePath("/"),
            title: this.$t("navigation.discoverPublicRecipes")
          },
          {
            path: this.localePath("/cooks/"),
            title: this.$t("navigation.discoverCooks")
          }
        ];
      } else {
        menuItems = [
          { path: this.localePath("/login/"), title: this.$t("loginText") },
          { path: this.localePath("/sign-up/"), title: this.$t("signUpText") },
          {
            headline: this.$t("navigation.footer.aboutHeading"),
            path: this.localePath("/about/"),
            title: this.$t("navigation.footer.aboutText")
          }
        ];
      }
      return menuItems;
    }
  },
  methods: {
    toggleMenu() {
      this.burgerMenuOpen = !this.burgerMenuOpen;
      this.$emit("toggle-menu", this.burgerMenuOpen);
    },
    closeMenu() {
      this.burgerMenuOpen = false;
      this.$emit("toggle-menu", false);
    },
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push(this.localePath("/"));
      this.burgerMenuOpen = false;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
