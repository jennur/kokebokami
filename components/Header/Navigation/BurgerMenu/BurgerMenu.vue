<template>
  <div class="burger-menu">
    <burger-icon @click.native="$emit('toggle-menu')" :open="open" />
    <transition name="burger-list-slide">
      <div v-if="open" class="burger-menu_list-container">
        <burger-list
          :menuItems="menuItems"
          :user="user"
          @close-menu="$emit('toggle-menu')"
          @logout="$emit('logout')"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import BurgerIcon from "./BurgerIcon.vue";
import BurgerList from "./BurgerList.vue";

export default {
  name: "burger-menu",
  components: {
    BurgerIcon,
    BurgerList
  },
  props: {
    loginMenu: {
      type: Array,
      default: () => []
    },
    menuItems: {
      type: Array,
      default: () => []
    },
    open: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
