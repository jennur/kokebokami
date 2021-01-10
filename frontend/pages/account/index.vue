<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />

    <div class="flex-row margin-vertical-2xl">
      <gateway-link
        v-for="(gateway, index) in gateways"
        :key="`gateway-link-${index}`"
        :gateway="gateway"
      />
    </div>
    <div
      class="full-width flex-column flex-column--align-right margin-vertical-lg"
    >
      <button class="logout-button" @click="logOut">{{ $t("logout") }}</button>
    </div>
  </div>
</template>

<script>
import GatewayLink from "~/components/GatewayLink.vue";
export default {
  name: "account",
  head() {
    return {
      title: `My account | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/"
        }
      ]
    };
  },
  components: {
    GatewayLink
  },

  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("navigation.myAccount") }
      ];
    },
    gateways() {
      return [
        {
          title: this.$t("navigation.shoppingLists"),
          link: this.localePath("/account/shopping-list/"),
          description: this.$t("account.shoppingListsDescription"),
          graphic: {
            name: "shopping-list"
          }
        },
        {
          title: this.$t("navigation.myCookbook"),
          link: this.localePath("/account/my-cookbook/"),
          description: this.$t("account.myCookbookDescription"),
          graphic: {
            name: "cookbook"
          }
        },
        {
          title: this.$t("navigation.accountDetails"),
          link: this.localePath("/account/account-details/"),
          description: this.$t("account.accountDetailsDescription"),
          graphic: {
            name: "account-details"
          }
        }
      ];
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch("USER_SIGN_OUT");
      this.$router.push(this.localePath("/"));
    }
  }
};
</script>
