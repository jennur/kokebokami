<template>
  <div class="navigation-menu_icons">
    <NuxtLink
      :to="$localePath('/account/shopping-list/')"
      class="icon_link"
      title="Shopping list"
    >
      <i-shopping-list-icon class="icon--shopping-list" />
      <transition name="pop">
        <span
          v-show="
            shoppingListStore.count && $route.path !== '/account/shopping-list/'
          "
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
      <i-cooks-icon class="icon--cooks" />
    </NuxtLink>
    <!--
          <favorites-icon class="icon--favorites" />
        -->
  </div>
</template>

<script setup>
import { useShoppingListStore } from "~/store";

const shoppingListStore = useShoppingListStore();
</script>
