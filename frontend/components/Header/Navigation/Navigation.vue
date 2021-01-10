<template>
  <nav
    class="navigation-menu-wrapper padding-horizontal-lg margin-auto desktop-width"
  >
    <div class="flex-row flex-row--align-center">
      <logo />
      <ul class="navigation-menu_language-selector">
        <li><nuxt-link :to="switchLocalePath('no')" title="Norsk">NO</nuxt-link></li>
        <li><nuxt-link :to="switchLocalePath('en')" title="English">EN</nuxt-link></li>
      </ul>
    </div>

    <div class="navigation-menu">
      <desktop-menu
        class="navigation-menu_desktop-menu"
        :accountMenu="accountMenu"
        :loginMenu="loginMenu"
        :user="user"
        @logout="logOut"
      />

      <shortcuts v-if="user && user.id" />

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
import user from "~/mixins/user.js";

import BurgerMenu from "./BurgerMenu/BurgerMenu.vue";
import DesktopMenu from "./DesktopMenu/DesktopMenu.vue";
import Shortcuts from "./Shortcuts.vue";

export default {
  name: "navigation",
  components: {
    Logo,
    BurgerMenu,
    DesktopMenu,
    Shortcuts
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
