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
<style scoped>
.navigation-menu {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 70px;
}

.navigation-menu__logo {
  padding: 0px 25px;
}

.navigation-menu__logo-link {
  color: #ff7300 !important;
  font-size: 25px;
  cursor: pointer !important;
  text-decoration: none;
  font-family: "Delius Swash Caps", cursive;
}

.navigation-menu__list {
  display: flex;
  align-items: center;
  list-style: none;
}
.navigation-menu__list li {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  height: 30px;
  margin-left: 25px;
}

.navigation-menu__link {
  color: rgb(9, 70, 110);
  text-decoration: none;
  margin-bottom: 2px;
  border-bottom: 2px solid #00e78f;
}

.navigation-menu__link:hover {
  margin-bottom: 0px;

  border-bottom: 4px solid #00e78f;
}
.google-profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.logout-button {
  display: inline-block;
  border: 2px solid #00e78f;
  border-radius: 5px;
  padding: 5px 10px 8px 10px;
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: 1em;
  cursor: pointer;
  background-color: #fff;
}
.logout-button:hover {
  background-color: #00e78f !important;
}
.active-link {
  text-decoration: none;
  color: gray;
  border-bottom: none;
  cursor: default;
}
.active-link:hover {
  border-bottom: none;
  margin-bottom: 2px;
}
</style>
