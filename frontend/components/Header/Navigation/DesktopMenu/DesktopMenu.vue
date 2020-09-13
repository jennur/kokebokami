<template>
  <!-- Desktop menu -->
  <div class="desktop-menu" v-click-outside="closeDropdown">
    <ul v-if="user && !user.id" class="login-menu">
      <li>
        <nuxt-link
          class="login-menu__signup-btn"
          :to="localePath('/sign-up')"
          >{{ $t("signUpText") }}</nuxt-link
        >
      </li>
      <li>
        <nuxt-link class="login-menu__link" :to="localePath('/login')">
          {{ $t("loginText") }}</nuxt-link
        >
      </li>
    </ul>
    <div v-if="user && user.id" class="account-menu margin-bottom--small">
      <user-image :username="user.displayName" :photoURL="user.photoURL" />
      <!-- Link -->
      <nuxt-link class="account-menu__button" :to="localePath('/account')">{{
        accountMenu.title
      }}</nuxt-link>
      <!-- <transition name="pop-dropdown">
        <dropdown-menu
          v-if="open"
          :links="accountMenu.subLinks"
          @logout="$emit('logout')"
          @close="closeDropdown"
        />
      </transition>-->
    </div>
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";

import UserImage from "../UserImage.vue";
import DropdownMenu from "./DropdownMenu.vue";

export default {
  name: "desktop-menu",
  components: {
    UserImage,
    DropdownMenu
  },
  props: {
    accountMenu: {
      type: Object,
      default: {}
    },
    loginMenu: {
      type: Array,
      default: []
    },
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },
    closeDropdown() {
      this.open = false;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
