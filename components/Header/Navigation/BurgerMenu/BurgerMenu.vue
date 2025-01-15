<template>
  <div class="burger-menu">
    <burger-icon @click.native="emit('toggle-menu')" :open="open" />
    <transition name="burger-list-slide">
      <div v-if="open" class="burger-menu_list-container">
        <burger-list
          :menuItems="menuItems"
          :user="user"
          @close-menu="emit('toggle-menu')"
          @logout="emit('logout')"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import BurgerIcon from "./BurgerIcon.vue";
import BurgerList from "./BurgerList.vue";
import useUser from "~/composables/user.js";

const { $localePath } = useNuxtApp();
const { t } = useI18n();

const emit = defineEmits(["toggle-menu", "logout"]);

const props = defineProps({
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
});

const user = computed(() => useUser());

const menuItems = computed(() => {
  let links = [];
  if (user.value && user.value.id !== null) {
    links = [
      {
        path: $localePath("/account/"),
        title: `${user.value.displayName}`,
        img: {
          url: user.value.photoURL
        },
        subLinks: [
          {
            path: $localePath("/account/my-cookbook/"),
            title: t("navigation.myCookbook")
          },
          {
            path: $localePath("/account/shopping-list/"),
            title: t("navigation.shoppingLists")
          },
          {
            path: $localePath("/account/account-details/"),
            title: t("navigation.accountDetails")
          }
        ]
      },
      {
        path: $localePath("/"),
        title: t("navigation.discoverPublicRecipes")
      },
      {
        path: $localePath("/cooks/"),
        title: t("navigation.discoverCooks")
      }
    ];
  } else {
    links = [
      { path: $localePath("/login/"), title: t("loginText") },
      { path: $localePath("/sign-up/"), title: t("signUpText") },
      {
        headline: t("navigation.footer.aboutHeading"),
        path: $localePath("/about/"),
        title: t("navigation.footer.aboutText")
      }
    ];
  }
  return links;
});
</script>
