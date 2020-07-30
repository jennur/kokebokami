<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />

    <div class="flex-row margin-vertical--xxlarge">
      <gateway-link
        v-for="(gateway, index) in gateways"
        :key="`gateway-link-${index}`"
        :gateway="gateway"
      />
    </div>
    <div
      class="full-width flex-column flex-column--align-right margin-vertical--large"
    >
      <button class="logout-button" @click="logOut">Log out</button>
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
          href: "https://www.kokebokami.com/account/"
        }
      ]
    };
  },
  components: {
    GatewayLink
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "My account" }]
    }
  },
  computed: {
    gateways() {
      return [
        {
          title: "My cookbook",
          link: "/account/my-cookbook/",
          description: "See and manage all your recipes",
          graphic: {
            name: "cookbook"
          }
        },
        {
          title: "Shopping lists",
          link: "/account/shopping-list/",
          description: "See and manage your shopping lists",
          graphic: {
            name: "shopping-list"
          }
        },
        {
          title: "Account details",
          link: "/account/account-details/",
          description: "See and manage your account details",
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
      this.$router.push("/");
    }
  }
};
</script>
