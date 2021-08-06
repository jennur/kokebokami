<template>
  <!-- Desktop menu -->
  <div class="desktop-menu" v-click-outside="closeDropdown">
    <ul v-if="user && !user.id" class="login-menu">
      <li>
        <nuxt-link class="login-menu_signup-btn" :to="localePath('/sign-up')">
          {{ $t("signUpText") }}
        </nuxt-link>
      </li>
      <li>
        <span class="login-menu_link" 
              tabindex="0" 
              @keydown="event => event.keyCode === 13 && toggleDropdown()" 
              @click="toggleDropdown"
              >
          {{ $t("loginText") }}
        </span>

        <transition name="pop-dropdown">
          <login-menu v-if="open" />
        </transition>
      </li>
    </ul>

    <div v-if="user && user.id" class="account-menu margin-bottom-sm">
      <user-image :username="user.displayName" :photoURL="user.photoURL" />
      <nuxt-link class="account-menu_button" :to="localePath('/account')">
        {{ accountMenu.title }}
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";

import UserImage from "../UserImage.vue";
import LoginMenu from "./LoginMenu.vue";

export default {
  name: "desktop-menu",
  components: {
    UserImage,
    LoginMenu
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
