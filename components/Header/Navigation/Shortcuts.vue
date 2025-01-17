<template>
  <div class="navigation-menu_icons">
        <NuxtLink
          :to="$localePath('/account/shopping-list/')"
          class="icon_link"
          title="Shopping list"
        >
          <ShoppingListIcon class="icon--shopping-list" />
          <transition name="pop">
            <span
              v-show="shoppingListStore.count && $route.path !== '/account/shopping-list/'"
              class="icon_notification"
            >
              {{ shoppingListStore.count }}</span
            >
          </transition>
        </NuxtLink>
        <NuxtLink
          :to="$localePath('/cooks/')"
          class="icon_link"
          title="Discover cooks"
        >
          <CooksIcon class="icon--cooks" />
        </NuxtLink>
        <!--
          <favorites-icon class="icon--favorites" />
        -->
      </div>
</template>

<script setup>
import ShoppingListIcon from "~/assets/graphics/icons/shopping-list-icon.svg";
import CooksIcon from "~/assets/graphics/icons/cooks-icon.svg";
// import FavoritesIcon from "~/assets/graphics/icons/favorites-icon.svg";
import { useShoppingListStore } from "~/store";

const shoppingListStore = useShoppingListStore();
</script>
