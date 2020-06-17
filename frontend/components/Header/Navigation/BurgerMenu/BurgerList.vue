<template>
  <ul class="burger-menu__list">
    <li v-for="menuItem in menuItems" :key="menuItem.title">
      <div class="flex-row flex-row--nowrap flex-row--align-center">
        <user-image
          v-if="menuItem.img"
          :username="user.displayName"
          :photoURL="menuItem.img && menuItem.img.url"
        />
        <nuxt-link
          class="burger-menu__link"
          :to="menuItem.path"
          @click.native="$emit('closeMenu')"
          >{{ menuItem.title }}</nuxt-link
        >
      </div>
      <ul
        v-if="menuItem.subLinks"
        class="burger-menu__sub-list margin-top--medium margin-bottom--large"
      >
        <li v-for="link in menuItem.subLinks" :key="link.title">
          <nuxt-link
            class="burger-menu__link"
            :to="link.path"
            @click.native="$emit('closeMenu')"
            >{{ link.title }}</nuxt-link
          >
        </li>
      </ul>
    </li>
    <li v-if="user">
      <button class="logout-button" @click="$emit('logout')">Log out</button>
    </li>
  </ul>
</template>
<script>
import UserImage from "../UserImage.vue";

export default {
  name: "burger-list",
  components: {
    UserImage
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
