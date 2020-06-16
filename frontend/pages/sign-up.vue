<template>
  <div>
    <sign-up-section
      headline="Sign up to start adding your recipes"
      :bigHeadline="true"
      :darkBg="false"
    />
  </div>
</template>

<script>
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

export default {
  name: "sign-up",
  head() {
    return {
      title: `Sign up | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/sign-up/"
        }
      ]
    };
  },
  components: {
    SignUpSection
  }
};
</script>
