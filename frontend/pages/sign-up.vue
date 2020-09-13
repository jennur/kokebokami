<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <sign-up-section :darkBg="false" :signUpPage="true" />
  </div>
</template>

<script>
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

export default {
  name: "sign-up",
  head() {
    return {
      title: `Sign up | Kokebokami`,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Sign up to start building your personal cookbook with Kokebokami."
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Sign up"
        },
        {
          hid: "og:description",
          property: "og:description",
          content:
            "Sign up to start building your personal cookbook with Kokebokami."
        }
      ],
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/sign-up/"
        }
      ]
    };
  },
  components: {
    SignUpSection
  },
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("signUpText") }
      ];
    }
  }
};
</script>
