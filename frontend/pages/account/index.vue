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
          title: "Shopping list",
          link: "/account/shopping-list/",
          description: "See and manage your shopping list"
        },
        {
          title: "Account details",
          link: "/account/account-details/",
          description: "See and manage your account details"
        }
      ];
    }
  }
};
</script>
