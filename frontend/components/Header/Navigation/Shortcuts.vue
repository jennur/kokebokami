<template>
  <div class="navigation-menu_icons">
        <nuxt-link
          :to="localePath('/account/shopping-list/')"
          class="icon_link"
          title="Shopping list"
        >
          <shopping-list-icon class="icon--shopping-list" />
          <transition name="pop">
            <span
              v-show="$store.state.shoppingListCount && $route.path !== '/account/shopping-list/'"
              class="icon_notification"
            >
              {{ $store.state.shoppingListCount }}</span
            >
          </transition>
        </nuxt-link>
        <nuxt-link
          :to="localePath('/cooks/')"
          class="icon_link"
          title="Discover cooks"
        >
          <cooks-icon class="icon--cooks" />
        </nuxt-link>
        <!--
          <favorites-icon class="icon--favorites" />
        -->
      </div>
</template>

<script>
import ShoppingListIcon from "~/assets/graphics/icons/shopping-list-icon.svg";
import CooksIcon from "~/assets/graphics/icons/cooks-icon.svg";
import FavoritesIcon from "~/assets/graphics/icons/favorites-icon.svg";

export default {
  name: "shortcuts",
  components: {
    ShoppingListIcon,
    CooksIcon,
    FavoritesIcon
  }
}
</script>
