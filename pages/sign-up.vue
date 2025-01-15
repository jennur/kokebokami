<template>
    <sign-up-section :darkBg="false" :signUpPage="true" />
</template>

<script>
import SignUpSection from "~/components/SignUpSection/SignUpSection.vue";

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
  }
};
</script>
