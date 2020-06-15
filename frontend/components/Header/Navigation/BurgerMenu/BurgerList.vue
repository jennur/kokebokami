<template>
  <div class="burger-menu__list-container">
    <ul class="burger-menu__list">
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
          class="burger-menu__link"
          :to="menuItem.link"
          @click.native="$emit('closeMenu')"
          >{{ menuItem.name }}</nuxt-link
        >
      </li>
      <li v-if="user">
        <button class="logout-button" @click="$emit('logout')">Log out</button>
      </li>
    </ul>
  </div>
</template>
<script>
import BackupImg from "~/assets/graphics/cook-silhouette-circle.svg";

export default {
  name: "burger-list",
  components: {
    BackupImg
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {}
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  }
};
</script>
