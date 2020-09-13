<template>
  <ul class="burger-menu__list">
    <li v-for="menuItem in menuItems" :key="menuItem.title">
      <div class="flex-row flex-row--nowrap flex-row--align-center">
        <user-image
          v-if="menuItem.img"
          :username="user.displayName"
          :photoURL="menuItem.img && menuItem.img.url"
        />
        <span>
          <h5
            v-if="menuItem.headline"
            class="margin-top--xxlarge margin-bottom--small color--blue"
          >
            {{ menuItem.headline }}
          </h5>
          <nuxt-link
            v-if="!menuItem.noLink"
            class="burger-menu__link"
            :to="menuItem.path"
            @click.native="$emit('close-menu')"
            >{{ menuItem.title }}</nuxt-link
          ></span
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
            @click.native="$emit('close-menu')"
            >{{ link.title }}</nuxt-link
          >
        </li>
      </ul>
    </li>
    <li v-if="user && user.id">
      <button class="logout-button" @click="$emit('logout')">
        {{ $t("logout") }}
      </button>
    </li>
    <li>
      <h5 class="margin-top--xxlarge margin-bottom--small color--blue">
        {{ $t("navigation.footer.languageHeading") }}
      </h5>
    </li>
    <li>
      <nuxt-link class="burger-menu__link" to="/">English</nuxt-link>
    </li>
    <li>
      <nuxt-link class="burger-menu__link" to="/no/">Norsk (beta)</nuxt-link>
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
