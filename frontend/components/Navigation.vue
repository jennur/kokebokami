<template>
  <nav class="navigation-menu">
    <ul class="navigation-menu__list">
      <li v-for="menuItem in menuItems" :key="menuItem.name">
        <nuxt-link class="navigation-menu__link" :to="menuItem.link">{{menuItem.name}}</nuxt-link>
      </li>
      <li v-if="user">
        <button class="logut-button" @click="logOut">Log out</button>
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
          { link: "/", name: "Home" },
          { link: "/account", name: "Account" }
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
<style scoped>
.navigation-menu {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
}

.navigation-menu__list {
  display: block;
  list-style: none;
}
.navigation-menu__list li {
  display: inline-block;
  margin-left: 25px;
}

.navigation-menu__link {
  color: rgb(9, 70, 110);
  text-decoration: none;
  border-bottom: 2px solid #289128;
}

.navigation-menu__link:hover {
  border-bottom: 4px solid #289128;
}
.logut-button {
  border: 2px solid #289128;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
}
.active-link {
  text-decoration: none;
  color: gray;
  border-bottom: none;
  cursor: default;
}
.active-link:hover {
  border-bottom: none;
}
</style>
