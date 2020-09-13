<template>
  <ul class="footer__nav margin--large">
    <li>
      <h4 class="color--blue">
        {{ $t("navigation.footer.shortcutsHeading") }}
      </h4>
    </li>
    <li v-for="route in shortcutLinks" :key="route.path">
      <nuxt-link :to="route.path">{{ route.name }}</nuxt-link>
    </li>
  </ul>
</template>
<script>
import user from "~/mixins/user.js";
export default {
  name: "shortcuts",
  mixins: [user],
  computed: {
    shortcutLinks() {
      if (this.user && this.user.id) {
        return [
          {
            name: this.$t("navigation.recipes"),
            path: this.localePath("/")
          },
          {
            name: this.$t("navigation.cooks"),
            path: this.localePath("/cooks/")
          }
        ];
      }
      return [
        {
          name: this.$t("loginText"),
          path: this.localePath("/login/")
        },
        {
          name: this.$t("signUpText"),
          path: this.localePath("/sign-up/")
        }
      ];
    }
  }
};
</script>
